// import { useState, useEffect } from "react";
// import { useGeneralQuery } from "@/app/hooks/(deprecated)/useGeneralQuery";
// import {
//     Folder,
//     File,
//     AIModel,
//     CodeBlock,
//     DataAnalysis,
//     Dataset,
//     Experiment,
//     Paper
// } from "@/types/workTypes";
// import { ProjectLayout } from "@/types/projectTypes";
// import { User } from "@/types/userTypes";
// import { ProjectSubmission } from "@/types/versionControlTypes";
// import { useGeneralQueryAPI } from "../../useGeneralQueryAPI";
// import { shallowEqual } from "@/utils/functions";
// import deepEqual from "fast-deep-equal";

// const useProjectDataAPI = (projectId: number, enabled: boolean) => {
//     const { data, error } = useGeneralQueryAPI<ProjectLayout>({
//         tableName: "projects",
//         tableRowsIds: [projectId.toString()],
//         categories: [
//             "users",
//             "folders",
//             "files",
//             "experiments",
//             "datasets",
//             "data_analyses",
//             "ai_models",
//             "code_blocks",
//             "papers",
//             "project_submissions",
//         ],
//         categoriesFetchMode: {
//             users: "all",
//             folders: "all",
//             files: "all",
//             experiments: "all",
//             datasets: "all",
//             data_analyses: "all",
//             ai_models: "all",
//             code_blocks: "all",
//             papers: "all",
//             project_submissions: "all",
//         },
//         enabled: enabled,
//     });
//     const [projectData, setProjectData] = useState<ProjectLayout | null>(null);
//     const firstProject = (data || [])[0];

//     useEffect(() => {
//         if (firstProject) {
            
//     console.log("Data changed:", data);
//             const {
//                 created_at,
//                 name,
//                 research_score,
//                 h_index,
//                 total_project_citations_count,
//                 total_citations_count,
//                 data_analyses,
//                 ai_models,
//                 code_blocks,
//                 ...restOfFirstProject
//             } = firstProject as any;
//             const transformedFirstProject = {
//                 ...restOfFirstProject,
//                 createdAt: created_at,
//                 name: name,
//                 researchScore: research_score,
//                 hIndex: h_index,
//                 totalProjectCitationsCount: total_project_citations_count,
//                 totalCitationsCount: total_citations_count,
//                 dataAnalyses: data_analyses,
//                 aiModels: ai_models,
//                 codeBlocks: code_blocks,
//             };

//             let transformedUsers: User[] = [];
//             let transformedFolders: Folder[] = [];
//             let transformedFiles: File[] = [];
//             let transformedExperiments: Experiment[] = [];
//             let transformedDatasets: Dataset[] = [];
//             let transformedDataAnalyses: DataAnalysis[] = [];
//             let transformedAIModels: AIModel[] = [];
//             let transformedCodeBlocks: CodeBlock[] = [];
//             let transformedPapers: Paper[] = [];

//             let transformedSubmissions: ProjectSubmission[] = [];

//             if (transformedFirstProject.users) {
//                 transformedUsers = transformedFirstProject.users.map(
//                     (user: any) => {
//                         const transformedUser: User = {
//                             id: user.id,
//                             username: user.username,
//                             fullName: user.full_name,
//                         };
//                         return transformedUser;
//                     }
//                 );
//             }

//             if (transformedFirstProject.folders) {
//                 transformedFolders = transformedFirstProject.folders.map(
//                     (folder: any) => {
//                         const transformedFolder: Folder = {
//                             id: folder.id,
//                             parentId: folder.parent_id,
//                             projectId: firstProject.id,
//                             name: folder.name,
//                             type: folder.type,
//                             contents: folder.contents,
//                             createdAt: folder.created_at,
//                             updatedAt: folder.updated_at,
//                         };
//                         return transformedFolder;
//                     }
//                 );
//             }

//             if (transformedFirstProject.files) {
//                 transformedFiles = transformedFirstProject.files.map(
//                     (file: any) => {
//                         return {
//                             id: file.id,
//                             projectId: firstProject.id,
//                             parentId: file.folder_id,
//                             name: file.name,
//                             type: file.type,
//                             content: file.content,
//                             createdAt: file.created_at,
//                             updatedAt: file.updated_at,
//                         };
//                     }
//                 );
//             }

//             if (transformedFirstProject.experiments) {
//                 transformedExperiments =
//                     transformedFirstProject.experiments.map(
//                         (experiment: any) => {
//                             return {
//                                 id: experiment.id,
//                                 projectId: firstProject.id,
//                                 parentId: experiment.folder_id,
//                                 createdAt: experiment.created_at,
//                                 title: experiment.title,
//                                 description: experiment.description,
//                                 methodology: experiment.methodology,
//                                 status: experiment.status,
//                                 public: experiment.public,
//                             };
//                         }
//                     );
//             }

//             if (transformedFirstProject.datasets) {
//                 transformedDatasets = transformedFirstProject.datasets.map(
//                     (dataset: any) => {
//                         return {
//                             id: dataset.id,
//                             projectId: firstProject.id,
//                             createdAt: dataset.created_at,
//                             parentId: dataset.folder_id,
//                             title: dataset.title,
//                             description: dataset.description,
//                             filepath: dataset.filepath,
//                             public: dataset.public,
//                         };
//                     }
//                 );
//             }

//             if (transformedFirstProject.dataAnalyses) {
//                 transformedDataAnalyses =
//                     transformedFirstProject.dataAnalyses.map(
//                         (dataAnalysis: any) => {
//                             return {
//                                 id: dataAnalysis.id,
//                                 projectId: firstProject.id,
//                                 createdAt: dataAnalysis.created_at,
//                                 parentId: dataAnalysis.folder_id,
//                                 title: dataAnalysis.title,
//                                 description: dataAnalysis.description,
//                                 notebookPath: dataAnalysis.notebook_path,
//                                 public: dataAnalysis.public,
//                             };
//                         }
//                     );
//             }

//             if (transformedFirstProject.aiModels) {
//                 transformedAIModels = transformedFirstProject.aiModels.map(
//                     (aiModel: any) => {
//                         return {
//                             id: aiModel.id,
//                             projectId: firstProject.id,
//                             createdAt: aiModel.created_at,
//                             parentId: aiModel.folder_id,
//                             name: aiModel.name,
//                             description: aiModel.description,
//                             public: aiModel.public,
//                         };
//                     }
//                 );
//             }

//             if (transformedFirstProject.codeBlocks) {
//                 transformedCodeBlocks = transformedFirstProject.codeBlocks.map(
//                     (codeBlock: any) => {
//                         return {
//                             id: codeBlock.id,
//                             projectId: firstProject.id,
//                             createdAt: codeBlock.created_at,
//                             parentId: codeBlock.folder_id,
//                             name: codeBlock.name,
//                             description: codeBlock.description,
//                             code: codeBlock.code,
//                             public: codeBlock.public,
//                         };
//                     }
//                 );
//             }

//             if (transformedFirstProject.papers) {
//                 transformedPapers = transformedFirstProject.papers.map(
//                     (paper: any) => {
//                         return {
//                             id: paper.id,
//                             projectId: firstProject.id,
//                             createdAt: paper.created_at,
//                             parentId: paper.folder_id,
//                             title: paper.title,
//                             description: paper.description,
//                             public: paper.public,
//                         };
//                     }
//                 );
//             }

//             if (transformedFirstProject.project_submissions) {
//                 transformedSubmissions =
//                     transformedFirstProject.project_submissions.map(
//                         (projectSubmission: any) => {
//                             return {
//                                 id: projectSubmission.id,
//                                 projectId: firstProject.id,
//                                 createdAt: projectSubmission.created_at,
//                                 initialProjectVersionId:
//                                     projectSubmission.initial_project_version_id,
//                                 finalProjectVersionId:
//                                     projectSubmission.final_project_version_id,
//                             };
//                         }
//                     );
//             }

//             const transformedProject: ProjectLayout = {
//                 id: transformedFirstProject.id,
//                 createdAt: transformedFirstProject.createdAt,
//                 researchScore: transformedFirstProject.researchScore,
//                 hIndex: transformedFirstProject.hIndex,
//                 totalProjectCitationsCount:
//                     transformedFirstProject.totalProjectCitationsCount,
//                 totalCitationsCount:
//                     transformedFirstProject.totalCitationsCount,
//                 title: transformedFirstProject.title,
//                 name: transformedFirstProject.name,
//                 description: transformedFirstProject.description,
//                 license: transformedFirstProject.license,
//                 public: transformedFirstProject.public,
//                 users: transformedUsers,
//                 folders: transformedFolders,
//                 files: transformedFiles,
//                 experiments: transformedExperiments,
//                 datasets: transformedDatasets,
//                 dataAnalyses: transformedDataAnalyses,
//                 aiModels: transformedAIModels,
//                 codeBlocks: transformedCodeBlocks,
//                 papers: transformedPapers,
//                 projectSubmissions: transformedSubmissions,
//             };

//             if (!deepEqual(transformedProject, projectData)) {
//                 setProjectData(transformedProject);
//             }
//         }
//     }, [data]);

//     return { projectData, error };
// };

// export default useProjectDataAPI;
