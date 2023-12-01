import { ProjectLayout } from "@/types/projectTypes";
import { FetchResult, fetchGeneralData } from "./fetchGeneralData";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const fetchProjectData = async (
    supabase: SupabaseClient<Database>,
    projectId: number | undefined | null
): Promise<FetchResult<ProjectLayout>> => {
    let projectLayout: FetchResult<ProjectLayout>;

    if (projectId) {
        projectLayout = await fetchGeneralData<ProjectLayout>(supabase, {
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
                tableRowsIds: [projectId.toString()],
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
        });
    } else {
        projectLayout = {
            data: [],
            isLoading: true,
            serviceError: false,
        };
    }
    

    return projectLayout;
};
