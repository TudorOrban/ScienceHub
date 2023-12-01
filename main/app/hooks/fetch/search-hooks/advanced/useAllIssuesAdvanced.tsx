import { useAdvancedSearch } from "@/app/advanced-search/hooks/useAdvancedSearch";
import { Issue } from "@/types/managementTypes";

type AllIssuesAdvancedParams = {
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllIssuesAdvanced = ({
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllIssuesAdvancedParams) => {
    const projectIssuesData = useAdvancedSearch<Issue>({
        fetchGeneralDataParams: {
            tableName: "issues",
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
        extraFilters: { object_type: "Project" },
        context: context || "Browse Issues",
    })();

    const workIssuesData = useAdvancedSearch<Issue>({
        fetchGeneralDataParams: {
            tableName: "issues",
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
        extraFilters: { object_type: ["Experiment", "Dataset", "Data Analysis", "AI Model", "Code Block", "Paper"]},
        context: context || "Browse Issues",
    })();

    return { projectIssuesData: projectIssuesData, workIssuesData: workIssuesData, projectIssuesLoading: projectIssuesData, workIssuesLoading: workIssuesData.isLoading };
}