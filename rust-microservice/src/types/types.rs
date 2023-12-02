use std::collections::HashMap;
use std::fmt::Debug;
use serde::{Deserialize, Serialize};

// pub struct ProjectData {
//     pub id: i32,
//     pub title: Option<String>,
//     pub name: Option<String>,
//     pub description: Option<String>,
//     pub experiments: Option<Vec<Experiment>>,
//     pub datasets: Option<Vec<Dataset>>,
//     pub created_at: Option<String>,
//     pub updated_at: Option<String>,
//     pub public: Option<bool>,
// }



#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct ProjectData {
    pub id: i32,
    pub title: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub experiments: Option<Vec<Experiment>>,
    pub datasets: Option<Vec<Dataset>>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    // pub project_metadata: Option<ProjectMetadata>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct ProjectMetadata {
    pub license: Option<String>,
    pub research_grants: Option<String>,
    pub keywords: Option<String>,
    pub fields_of_research: Option<String>,
    pub supplimentary_materials: Option<String>,
    pub status: Option<String>,
    pub public: Option<bool>,
}

// Works
#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct WorkSmall {
    pub work_id: i32,
    pub work_type: String,
    pub work_version_id: i32,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Experiment {
    pub id: i32,
    pub title: String,
    pub project_id: Option<i32>,
    pub folder_id: Option<i32>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Dataset {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub project_id: Option<i32>,
    pub folder_id: Option<i32>,
}

#[derive(Deserialize, Serialize, Debug)]
pub enum Work {
    Experiment(Experiment),
    Dataset(Dataset),
}



// Submissions
pub struct ProjectSubmission {
    pub id: i32, 
    pub project_id: i32,
    pub initial_project_version_id: Option<i32>,
    pub final_project_version_id: Option<i32>,
    pub work_submissions_ids: Option<Vec<i32>>,
    pub created_at: Option<String>,
    // users: Option<Vec<User>>, 
    pub title: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
    pub is_pub: Option<bool>, 
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct WorkSubmission {
    pub id: i32,
    pub work_type: String,
    pub work_id: i32,
    pub initial_work_version_id: Option<i32>,
    pub final_work_version_id: Option<i32>,
    pub project_id: Option<i32>,
    pub work_delta: Option<DeltaData>,
    // pub created_at: Option<String>,
    // users: Option<Vec<User>>, 
    // pub title: Option<String>,
    // pub description: Option<String>,
    // pub status: Option<String>,
    // pub is_pub: Option<bool>,
}


// Versions
#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct ProjectVersion {
    pub id: i32,
    pub project_id: i32,
    pub version_number: i32, 
    pub works: Option<Vec<WorkSmall>>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct WorkVersion {
    pub id: i32,
    pub work_type: String,
    pub work_id: i32,
    pub version_number: Option<i32>,
    pub created_at: Option<String>,
    pub work_delta: Option<WorkDelta>
}


// Deltas
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct TextDiff {
    pub insert: String,
    pub position: i32,
    pub delete_count: i32,
}

pub type DeltaData = HashMap<String, Vec<TextDiff>>;

pub struct ProjectDelta {
    pub id: i32,
    pub initial_project_version_id: Option<i32>,
    pub final_project_version_id: Option<i32>,
    pub delta_data: DeltaData,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct WorkDelta {
    pub id: i32,
    pub work_type: String,
    pub work_version_id_from: i32,
    pub work_version_id_to: i32,
    pub delta_data: DeltaData,
}

// Snapshots and Graphs
#[derive(Serialize, Deserialize, Debug)]
pub struct WorkSnapshot {
    pub id: i32,
    pub work_id: String,
    pub work_type: String,
    pub work_version_id: i32,
    pub created_at: Option<String>,
    pub snapshot_data: Work,
}


#[derive(Deserialize, Serialize, Debug)]
pub struct NodeData {
    pub neighbors: Vec<String>,
    pub is_snapshot: bool,
}

type Graph = HashMap<String, NodeData>;

#[derive(Serialize, Deserialize, Debug)]
pub struct WorkVersionGraph {
    pub id: i32,
    pub created_at: Option<String>,
    pub work_id: i32,
    pub work_type: String,
    pub graph_data: Graph,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PathData {
    pub work_snapshot_data: WorkSnapshot,
    pub path_deltas: Vec<WorkDelta>,
}