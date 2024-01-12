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
    filters,
    activeTab,
    context,
    page,
    itemsPerPage,
}: AllReviewsAdvancedParams) => {
    const extraFilters = {
        ...filters,
        review_type: "Community Review",
        public: true,
    }

    const projectReviewsData = useAdvancedSearch<Review>({
        fetchGeneralDataParams: {
            tableName: "project_reviews",
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
        extraFilters: extraFilters,
        context: context || "Browse Reviews",
    })();

    const workReviewsData = useAdvancedSearch<Review>({
        fetchGeneralDataParams: {
            tableName: "work_reviews",
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
        extraFilters: extraFilters,
        context: context || "Browse Reviews",
    })();

    return {
        projectReviewsData: projectReviewsData,
        workReviewsData: workReviewsData,
        projectReviewsLoading: projectReviewsData,
        workReviewsLoading: workReviewsData.isLoading,
    };
};
