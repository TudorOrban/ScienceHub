import { ProjectLayout } from "@/types/projectTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useProjectData = (projectId: number, enabled?: boolean): HookResult<ProjectLayout> => {
    const projectLayout = useGeneralData<ProjectLayout>({
        fetchGeneralDataParams: {
            tableName: "projects",
            categories: [
                "users",
                "folders",
                "files",
                "experiments",
                "datasets",
                "data_analyses",
                "ai_models",
                "code_blocks",
                "papers",
                "project_submissions",
                "project_views",
                "project_upvotes",
                "project_shares",
            ],
            options: {
                tableRowsIds: [projectId],
                categoriesFetchMode: {
                    users: "fields",
                    folders: "all",
                    files: "all",
                    experiments: "fields",
                    datasets: "fields",
                    data_analyses: "fields",
                    ai_models: "fields",
                    code_blocks: "fields",
                    papers: "fields",
                    project_submissions: "fields",
                    project_views: "count",
                    project_upvotes: "count",
                    project_shares: "count",
                },
                // tableFields: [
                //     "id", "title", "project_name", 
                // ],
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    experiments: ["id", "title", "folder_id", "created_at"],
                    datasets: ["id", "title", "folder_id", "created_at"],
                    data_analyses: ["id", "title", "folder_id", "created_at"],
                    ai_models: ["id", "title", "folder_id", "created_at"],
                    code_blocks: ["id", "title", "folder_id", "created_at"],
                    papers: ["id", "title", "folder_id", "created_at"],
                    project_submissions: ["id", "created_at", "title"],
                },
                // relationshipNames: {
                //     users: "project_views",
                //     // users: "project_upvotes",
                //     // users: "project_shares",
                // },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    
    return projectLayout;
};

export default useProjectData;
