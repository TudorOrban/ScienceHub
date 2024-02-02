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
    const extraFilters = {
        ...filters,
        public: true,
    }

    const projectSubmissionsData = useAdvancedSearch<ProjectSubmission>({
        fetchGeneralDataParams: {
            tableName: "project_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "project_id",
                    "created_at",
                    "updated_at",
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
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Project Submissions",
        },
        extraFilters: extraFilters,
        context: context || "Browse Submissions",
    })();

    const workSubmissionsData = useAdvancedSearch<WorkSubmission>({
        fetchGeneralDataParams: {
            tableName: "work_submissions",
            categories: ["users"],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "created_at",
                    "updated_at",
                    "title",
                    "status",
                    "initial_work_version_id",
                    "final_work_version_id",
                    "public",
                    "link"
                ],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Work Submissions",
        },
        extraFilters: extraFilters,
        context: context || "Browse Submissions",
    })();
    
    return { projectSubmissionsData: projectSubmissionsData, workSubmissionsData: workSubmissionsData };
}