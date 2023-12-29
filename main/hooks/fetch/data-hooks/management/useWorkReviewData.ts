import { HookResult, useGeneralData } from "../../useGeneralData";
import { WorkReview } from "@/types/managementTypes";

export const useWorkReviewData = (reviewId: number, enabled?: boolean): HookResult<WorkReview> => {
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
        },
    });

    return reviewData;
}

