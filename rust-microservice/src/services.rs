
use serde::de::DeserializeOwned;
use serde_json;
use std::{env, result::Result};
use reqwest::{self, Client};
use serde_json::json;

use crate::error::MyError;
use crate::types::{
    types::{ProjectData, WorkVersionGraph}, ProjectVersion, WorkSnapshot, WorkSubmission,
};

// General service
pub async fn fetch_from_supabase<T: DeserializeOwned>(url_path: &str) -> Result<T, MyError> {
    let supabase_url =
        env::var("NEXT_PUBLIC_SUPABASE_URL").expect("NEXT_PUBLIC_SUPABASE_URL must be set");
    let supabase_key = env::var("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        .expect("NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");

    let url = format!("{}/rest/v1/{}", supabase_url, url_path);
    let client = Client::new();

    let response = client
        .get(&url)
        .header("apikey", &supabase_key)
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|err| MyError::new(&format!("HTTP request error: {}", err)))?
        .error_for_status()
        .map_err(|err| MyError::new(&format!("HTTP error status: {}", err)))?;

    let body = response
        .text()
        .await
        .map_err(|err| MyError::new(&format!("Error reading response body: {}", err)))?;

    println!("Raw Response Body: {}", body);

    serde_json::from_str(&body).map_err(|err| MyError::new(&format!("Error parsing JSON: {}", err)))
}

// Project data
pub async fn fetch_project_data_service(project_id: i32) -> Result<Option<ProjectData>, MyError> {
    let url_path = format!("projects?id=eq.{}", project_id);
    let project_data: Vec<ProjectData> = fetch_from_supabase(&url_path).await?;

    Ok(project_data.into_iter().next())
}

pub async fn fetch_project_version_service(
    project_version_id: i32,
) -> Result<Option<ProjectVersion>, MyError> {
    let url_path = format!("project_versions?id=eq.{}", project_version_id);

    let project_version_data: Vec<ProjectVersion> =
        fetch_from_supabase(&url_path).await.map_err(|err| {
            // `err` here represents the error returned by `fetch_from_supabase`
            MyError::new(&format!(
                "Network or API error in project_version_service: {}",
                err
            ))
        })?;

    Ok(project_version_data.into_iter().next())
}

// Work versions graph
pub async fn fetch_work_versions_graph_service(
    work_id: i32,
) -> Result<Option<WorkVersionGraph>, MyError> {
    let url_path = format!("work_versions_graphs?work_id=eq.{}", work_id.to_string());
    let work_versions_graphs: Vec<WorkVersionGraph> = fetch_from_supabase(&url_path).await?;

    Ok(work_versions_graphs.into_iter().next())
}

// Work submissions

pub async fn fetch_work_submissions_service(
    path_ids: Vec<i32>,
) -> Result<Option<Vec<WorkSubmission>>, MyError> {
    let supabase_url = env::var("NEXT_PUBLIC_SUPABASE_URL").expect("NEXT_PUBLIC_SUPABASE_URL must be set");
    let supabase_key = env::var("NEXT_PUBLIC_SUPABASE_ANON_KEY").expect("NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");

    if path_ids.len() < 2 {
        return Err(MyError::new("Not enough path IDs"));
    }

    let version_pairs: Vec<Vec<i32>> = path_ids.windows(2)
        .filter_map(|window| if window.len() == 2 { Some(vec![window[0], window[1]]) } else { None })
        .collect();

    let client = Client::new();
    let full_url = format!("{}/rest/v1/rpc/fetch_work_submissions", supabase_url);
    println!("Making request to URL: {}", full_url);

    let response = client
        .post(&full_url)
        .header("apikey", supabase_key)
        .header("Content-Type", "application/json")
        .json(&json!({ "version_pairs": version_pairs }))
        .send()
        .await
        .map_err(|err| MyError::new(&format!("HTTP request error: {}", err)))?;

    if response.status().is_success() {
        let submissions = response.json::<Vec<WorkSubmission>>().await
            .map_err(|err| MyError::new(&format!("Error parsing response JSON: {}", err)))?;
        Ok(Some(submissions))
    } else {
        let error_status = response.status();
        let error_body = response.text().await.unwrap_or_else(|_| "Failed to get response body".to_string());
        println!("Error status: {}, Error body: {}", error_status, error_body);
        Err(MyError::new(&format!("Error from Supabase: {}", error_status)))
    }
}


// Work snapshot
pub async fn fetch_work_snapshot(work_version_id: String) -> Result<Option<WorkSnapshot>, MyError> {
    let url_path = format!("work_snapshots?work_version_id=eq.{}", work_version_id);

    // Handle the Result returned by fetch_from_supabase
    let work_snapshots: Vec<WorkSnapshot> =
        fetch_from_supabase(&url_path).await.map_err(|err| {
            // Convert the reqwest::Error to a MyError
            MyError::new(&format!(
                "Network or API error in work_snapshot_service: {}",
                err
            ))
        })?;

    // Return the first item of the vector, if available
    Ok(work_snapshots.into_iter().next())
}

// let project_data: ProjectData = ProjectData {
//     id: 1, // Assuming id is an i32 and not optional
//     title: Some("Your Title".to_string()), // Replace with appropriate value or None
//     name: Some("Your Name".to_string()), // Replace with appropriate value or None
//     description: Some("Your Description".to_string()), // Replace with appropriate value or None
//     experiments: None, // Since this is an Option<Vec<Experiment>>, you can put None or Some(vec_of_experiments)
//     datasets: None, // Similar to experiments, None or Some(vec_of_datasets)
//     created_at: Some("Creation Date".to_string()), // Replace with appropriate value or None
//     updated_at: Some("Update Date".to_string()), // Replace with appropriate value or None
//     public: Some(true), // Assuming public is an Option<bool>, replace true with appropriate value or None
// };
