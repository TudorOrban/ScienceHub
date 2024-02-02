import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { ProjectReview } from "@/types/managementTypes";

export const useProjectReviewData = (
    reviewId: number,
    enabled?: boolean,
    initialData?: FetchResult<ProjectReview>
): HookResult<ProjectReview> => {
    const reviewData = useGeneralData<ProjectReview>({
        fetchGeneralDataParams: {
            tableName: "project_reviews",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [reviewId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            initialData: initialData,
        },
    });

    return reviewData;
};
