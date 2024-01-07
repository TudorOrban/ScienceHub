import { ProjectLayout } from "@/types/projectTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useProjectData = (projectId: number, enabled?: boolean, limitResults?: boolean): HookResult<ProjectLayout> => {
    const categoriesLimits = limitResults ? {
        experiments: 10,
        datasets: 10,
        data_analyses: 10,
        ai_models: 10,
        code_blocks: 10,
        papers: 10,
        project_submissions: 20,
        project_issues: 20,
    } : undefined;

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
                "project_issues",
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
                    project_issues: "fields",
                    project_views: "count",
                    project_upvotes: "count",
                    project_shares: "count",
                },
                // tableFields: [
                //     "id", "title", "project_name", 
                // ],
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    experiments: ["id", "title", "folder_id", "created_at", "work_type"],
                    datasets: ["id", "title", "folder_id", "created_at", "work_type"],
                    data_analyses: ["id", "title", "folder_id", "created_at", "work_type"],
                    ai_models: ["id", "title", "folder_id", "created_at", "work_type"],
                    code_blocks: ["id", "title", "folder_id", "created_at", "work_type"],
                    papers: ["id", "title", "folder_id", "created_at", "work_type"],
                    project_submissions: ["id", "created_at", "title", "status"],
                    project_issues: ["id", "created_at", "title", "status"],
                },
                categoriesLimits: categoriesLimits,
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
