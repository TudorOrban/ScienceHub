import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { WorkReview } from "@/src/types/managementTypes";

export const useWorkReviewData = (
    reviewId: number,
    enabled?: boolean,
    initialData?: FetchResult<WorkReview>
): HookResult<WorkReview> => {
    const reviewData = useGeneralData<WorkReview>({
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
