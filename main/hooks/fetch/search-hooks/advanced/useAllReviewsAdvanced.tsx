import { useAdvancedSearch } from "@/advanced-search/hooks/useAdvancedSearch";
import { Review } from "@/types/managementTypes";
type AllReviewsAdvancedParams = {
    filters?: Record<string, any>;
    activeTab: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllReviewsAdvanced = ({
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllReviewsAdvancedParams) => {
    const projectReviewsData = useAdvancedSearch<Review>({
        fetchGeneralDataParams: {
            tableName: "reviews",
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
            enabled: activeTab === "Project Reviews",
        },
        extraFilters: {
            object_type: "Project",
            review_type: "Community Review",
        },
        context: context || "Browse Reviews",
    })();

    const workReviewsData = useAdvancedSearch<Review>({
        fetchGeneralDataParams: {
            tableName: "reviews",
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
            enabled: activeTab === "Work Reviews",
        },
        extraFilters: {
            object_type: [
                "Experiment",
                "Dataset",
                "Data Analysis",
                "AI Model",
                "Code Block",
                "Paper",
            ],
            review_type: "Community Review",
        },
        context: context || "Browse Reviews",
    })();

    return {
        projectReviewsData: projectReviewsData,
        workReviewsData: workReviewsData,
        projectReviewsLoading: projectReviewsData,
        workReviewsLoading: workReviewsData.isLoading,
    };
};
