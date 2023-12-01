use std::sync::Arc;

use crate::diffing::apply_deltas_to_work_snapshot;
use crate::error::MyError;
use crate::services::{
    fetch_project_version_service, fetch_work_snapshot, fetch_work_submissions_service,
    fetch_work_versions_graph_service,
};
use crate::types::types::ProjectData;
use crate::types::{Work, ProjectMetadata};
use crate::utils::find_snapshot_and_path;

use futures::stream::FuturesUnordered;
use futures::StreamExt;
use tokio::sync::Mutex;
use tokio::task;

pub async fn find_project_version_data(
    project_id: i32,
    project_version_id: i32,
) -> Result<ProjectData, MyError> {
    // Fetch project version data to get necessary work versions
    let project_version_result = fetch_project_version_service(project_version_id).await;

    let project_version = match project_version_result {
        Ok(Some(data)) => data,
        Ok(None) => {
            eprintln!(
                "No project_version data found for project_id {}",
                project_version_id
            );
            return Err(MyError::new("Project version data not found"));
        }
        Err(e) => {
            eprintln!("Error fetching project data: {:?}", e);
            return Err(e);
        }
    };

    // Initialize return object
    let constructed_version_project_data = Arc::new(Mutex::new(ProjectData {
        id: project_id,
        experiments: Some(vec![]),
        datasets: Some(vec![]),
        title: Some(String::new()),
        name: Some(String::new()),
        description: Some(String::new()),
        created_at: Some(String::new()),
        updated_at: Some(String::new()),
        project_metadata: Some( ProjectMetadata {
            license: Some(String::new()),
            research_grants: Some(String::new()),
            keywords: Some(String::new()),
            fields_of_research: Some(String::new()),
            supplimentary_materials: Some(String::new()),
            status: Some(String::new()),
            public: Some(false),
         })
    }));



    // Loop through works to obtain corresponding version data
    let mut futures = FuturesUnordered::new();
    
    if let Some(works) = project_version.works {
        for work in works {
            // Clone data
            let work_clone = work.clone();
            let data_clone = constructed_version_project_data.clone();

            futures.push(task::spawn(async move {
                // Fetch work version graph
                let graph_result = fetch_work_versions_graph_service(work_clone.work_id).await;
                match graph_result {
                    Ok(Some(graph)) => {
                        // Find closest work snapshoot and path to it
                        let (work_version_id, path) =
                            find_snapshot_and_path(work_clone.work_version_id, graph);

                        if let Some(work_version_id) = work_version_id {
                            let path_as_integers: Vec<i32> =
                                path.iter().filter_map(|p| p.parse::<i32>().ok()).collect();

                            // Fetch the snapshot data
                            let snapshot_result =
                                fetch_work_snapshot(work_version_id).await;
                            match snapshot_result {
                                Ok(Some(mut snapshot)) => {
                                    // Fetch path submissions
                                    println!("PATH {:?}", path);
                                    match fetch_work_submissions_service(path_as_integers).await {
                                        Ok(Some(submissions)) => {
                                            // Loop through path submissions and sequentially apply their deltas
                                            for submission in submissions {
                                                if let Some(delta) = submission.work_delta {
                                                    apply_deltas_to_work_snapshot(&mut snapshot, delta);
                                                } else {
                                                    println!("Missing delta for submission id {}, abording", submission.id);
                                                }
                                            }
                                            

                                            let mut data = data_clone.lock().await;

                                            // Put obtained data into return project data
                                            match &mut snapshot.snapshot_data {
                                                Work::Experiment(experiment) => {
                                                    data.experiments
                                                        .as_mut()
                                                        .unwrap()
                                                        .push(experiment.clone());
                                                }
                                                Work::Dataset(dataset) => {
                                                    data.datasets
                                                        .as_mut()
                                                        .unwrap()
                                                        .push(dataset.clone());
                                                } 
                                                // ToDo: Handle other Work variants
                                            }
                                            Ok(())
                                        }
                                        Ok(None) => {
                                            eprintln!("No work submissions found");
                                            Err(MyError::new("No work submissions found"))
                                        }
                                        Err(e) => Err(e),
                                    }
                                }
                                Ok(None) => Err(MyError::new("No snapshot found")),
                                Err(e) => Err(e),
                            }
                        } else {
                            eprintln!("No snapshot found for work_id {}", work_clone.work_id);
                            Err(MyError::new("No snapshot found"))
                        }
                    }
                    Ok(None) => {
                        eprintln!("No graph found for work_id {}", work_clone.work_id);
                        Err(MyError::new("Graph not found"))
                    }
                    Err(e) => {
                        Err(MyError::new(&format!("Error fetching graph: {}", e)))
                    }
                }
            }));
        }

        // Process all futures concurrently
        while let Some(result) = futures.next().await {
            match result {
                Ok(Ok(_)) => println!("Work processed successfully"),
                Ok(Err(e)) => eprintln!("Error processing work: {:?}", e),
                Err(e) => eprintln!("Task panicked: {:?}", e),
            }
        }
    } else {
        eprintln!(
            "No works found for project_version_id {}",
            project_version_id
        );
        return Err(MyError::new("No works found")); 
    }

    // Attempt to unwrap the Arc and then access the inner Mutex
    let final_data_mutex = Arc::try_unwrap(constructed_version_project_data)
        .expect("Arc should have a single owner at this point");

    let final_data = final_data_mutex.into_inner();

    // Return the successfully extracted data
    Ok(final_data)
}
