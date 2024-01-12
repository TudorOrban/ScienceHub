import { useAdvancedSearch } from "@/advanced-search/hooks/useAdvancedSearch";import { ProjectSubmission, WorkSubmission } from "@/types/versionControlTypes";
;

type AllSubmissionsAdvancedParams = {
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllSubmissionsAdvanced = ({
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllSubmissionsAdvancedParams) => {
    const projectSubmissionsData = useAdvancedSearch<ProjectSubmission>({
        fetchGeneralDataParams: {
            tableName: "project_submissions",
            categories: ["projects", "users"],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "project_id",
                    "created_at",
                    "title",
                    "status",
                    "initial_project_version_id",
                    "final_project_version_id",
                    "public",
                    "link"
                ],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                    projects: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Project Submissions",
        },
        extraFilters: filters,
        context: context || "Browse Submissions",
    })();

    const workSubmissionsData = useAdvancedSearch<WorkSubmission>({
        fetchGeneralDataParams: {
            tableName: "work_submissions",
            categories: ["projects", "users"],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                    projects: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Work Submissions",
        },
        extraFilters: filters,
        context: context || "Browse Submissions",
    })();
    
    return { projectSubmissionsData: projectSubmissionsData, workSubmissionsData: workSubmissionsData, projectSubmissionsLoading: projectSubmissionsData, workSubmissionsLoading: workSubmissionsData.isLoading };
}