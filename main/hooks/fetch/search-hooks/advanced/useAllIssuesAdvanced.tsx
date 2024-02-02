import { useAdvancedSearch } from "@/advanced-search/hooks/useAdvancedSearch";
import { Issue } from "@/types/managementTypes";

type AllIssuesAdvancedParams = {
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

/**
 * Hook fetching all issues, using useAdvancedSearch. Used in Browse Issues page (to be refactored).
 * Executes only one fetch at a time depending on activeTab.
 */
export const useAllIssuesAdvanced = ({
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllIssuesAdvancedParams) => {
    const extraFilters = {
        ...filters,
        public: true,
    };

    const projectIssuesData = useAdvancedSearch<Issue>({
        fetchGeneralDataParams: {
            tableName: "project_issues",
            categories: ["users"],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Project Issues",
        },
        extraFilters: extraFilters,
        context: context || "Browse Issues",
    })();

    const workIssuesData = useAdvancedSearch<Issue>({
        fetchGeneralDataParams: {
            tableName: "work_issues",
            categories: ["users"],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id"],
                },
            },
        },
        reactQueryOptions: {
            enabled: activeTab === "Work Issues",
        },
        extraFilters: extraFilters,
        context: context || "Browse Issues",
    })();

    return {
        projectIssuesData: projectIssuesData,
        workIssuesData: workIssuesData,
        projectIssuesLoading: projectIssuesData,
        workIssuesLoading: workIssuesData.isLoading,
    };
};
