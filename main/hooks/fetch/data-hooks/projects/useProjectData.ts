import { ProjectLayout } from "@/types/projectTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

/**
 * Hook fetching medium project data with associated works
 */
const useProjectData = (
    projectId: number,
    enabled?: boolean,
    limitResults?: boolean
): HookResult<ProjectLayout> => {
    const categoriesLimits = limitResults
        ? {
              experiments: 10,
              datasets: 10,
              data_analyses: 10,
              ai_models: 10,
              code_blocks: 10,
              papers: 10,
              project_submissions: 20,
              project_issues: 20,
              project_reviews: 20,
          }
        : undefined;

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
                "project_reviews",
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
                    experiments: ["id", "title", "folder_id", "created_at", "work_type", "link"],
                    datasets: ["id", "title", "folder_id", "created_at", "work_type", "link"],
                    data_analyses: ["id", "title", "folder_id", "created_at", "work_type", "link"],
                    ai_models: ["id", "title", "folder_id", "created_at", "work_type", "link"],
                    code_blocks: ["id", "title", "folder_id", "created_at", "work_type", "link"],
                    papers: ["id", "title", "folder_id", "created_at", "work_type", "link"],
                    project_submissions: ["id", "created_at", "title", "status", "link"],
                    project_issues: ["id", "created_at", "title", "status", "link"],
                    project_reviews: ["id", "created_at", "title", "link"],
                },
                categoriesLimits: categoriesLimits,
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
