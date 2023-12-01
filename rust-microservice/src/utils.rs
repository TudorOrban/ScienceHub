use std::collections::{HashSet, VecDeque};

use crate::types::{WorkVersionGraph, ProjectData, Work};


pub fn find_snapshot_and_path(version_id: i32, graph: WorkVersionGraph) -> (Option<String>, Vec<String>) {
    let mut visited = HashSet::new();
    let mut queue = VecDeque::new();

    // Start from the given work_id, assuming it's a valid key in the graph
    if let Some(start_node) = graph.graph_data.get(&version_id.to_string()) {
        queue.push_back((version_id.to_string(), vec![]));

        while let Some((current_id, path)) = queue.pop_front() {
            if visited.contains(&current_id) {
                continue;
            }
            visited.insert(current_id.clone());

            let current_node = &graph.graph_data[&current_id];
            let new_path = [path.clone(), vec![current_id.clone()]].concat();

            // Check if this is a snapshot
            if current_node.is_snapshot {
                return (Some(current_id), new_path);
            }

            // Add neighbors to the queue
            for neighbor in &current_node.neighbors {
                if !visited.contains(neighbor) {
                    queue.push_back((neighbor.clone(), new_path.clone()));
                }
            }
        }
    }

    // Return None if no snapshot is found
    (None, Vec::new())
}

// Flatten project's works
pub fn flatten_project_data_works(project_data: ProjectData) -> Vec<Work> {
    let mut works = Vec::new();

    // If there are experiments, add them to the works vector
    if let Some(experiments) = project_data.experiments {
        for experiment in experiments {
            works.push(Work::Experiment(experiment));
        }
    }
    

    // If there are datasets, add them to the works vector
    if let Some(datasets) = project_data.datasets {
        for dataset in datasets {
            works.push(Work::Dataset(dataset));
        }
    }

    works
}
