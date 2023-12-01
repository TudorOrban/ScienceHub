mod services; // Include the services module
              // mod find_project_version_data;
mod diffing;
mod error;
mod find_project_version_data;
mod types;
mod utils;

use dotenv::dotenv;
use find_project_version_data::find_project_version_data;
use tokio;

#[tokio::main] // Use the tokio runtime for async execution
async fn main() {
    dotenv().ok(); // Load environment variables

    let version_project_data = find_project_version_data(1, 1).await;

    match version_project_data {
        Ok(version_project_data) => match version_project_data.datasets {
            Some(datasets) => {
                if let Some(dataset) = datasets.get(0) {
                    println!("Version project data: {:?}", dataset.description);
                } else {
                    println!("No version project data datasets found");
                }
            }
            None => println!("Datasets is None"),
        },
        Err(e) => {
            eprintln!("Error finding version project data: {}", e);
        }
    }
}
