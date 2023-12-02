mod diffing;
mod error;
mod find_project_version_data;
mod services;
mod types;
mod utils;

use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use find_project_version_data::find_project_version_data;
use serde::{Deserialize, Serialize};
use tokio;

// Input and output types
#[derive(Deserialize)]
struct ProjectVersionDataRequest {
    project_id: i32,
    project_version_id: i32,
}

#[derive(Serialize)]
struct ApiResponse<T> {
    data: T,
    error: Option<String>,
}

async fn get_project_version_data(info: web::Json<ProjectVersionDataRequest>) -> impl Responder {
    match find_project_version_data(info.project_id, info.project_version_id).await {
        Ok(data) => HttpResponse::Ok().json(ApiResponse { data, error: None }),
        Err(e) => HttpResponse::InternalServerError().json(ApiResponse {
            data: (),
            error: Some(e.to_string()),
        }),
    }
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    HttpServer::new(|| {
        let cors = Cors::permissive().allow_any_origin();
        App::new().wrap(cors).route(
            "/get_project_version_data",
            web::post().to(get_project_version_data),
        )
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await

    // dotenv().ok(); // Load environment variables

    // let version_project_data = find_project_version_data(1, 1).await;

    // match version_project_data {
    //     Ok(version_project_data) => match version_project_data.datasets {
    //         Some(datasets) => {
    //             if let Some(dataset) = datasets.get(0) {
    //                 println!("Version project data: {:?}", dataset.description);
    //             } else {
    //                 println!("No version project data datasets found");
    //             }
    //         }
    //         None => println!("Datasets is None"),
    //     },
    //     Err(e) => {
    //         eprintln!("Error finding version project data: {}", e);
    //     }
    // }
}
