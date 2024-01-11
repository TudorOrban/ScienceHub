import { ProjectLayout } from "@/types/projectTypes";
import { FetchResult, fetchGeneralData } from "./fetchGeneralData";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const fetchProjectData = async (
    supabase: SupabaseClient<Database>,
    projectId: number | undefined | null,
    limitResults?: boolean,
): Promise<FetchResult<ProjectLayout>> => {
    let projectLayout: FetchResult<ProjectLayout>;

    const categoriesLimits = limitResults ? {
        experiments: 10,
        datasets: 10,
        data_analyses: 10,
        ai_models: 10,
        code_blocks: 10,
        papers: 10,
        project_submissions: 10,
        project_issues: 10,
        project_reviews: 10,
    } : undefined;

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
                "project_issues",
                "project_reviews",
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
                    project_issues: "fields",
                    project_reviews: "fields",
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
                    project_submissions: ["id", "created_at", "title", "status", "initial_project_version_id", "final_project_version_id", "public"],
                    project_issues: ["id", "created_at", "title", "status", "public"],
                    project_reviews: ["id", "created_at", "title", "status", "public"],
                },
                categoriesLimits: categoriesLimits,
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
