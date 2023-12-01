import { HookResult, useGeneralData } from "../../useGeneralData";
import { Review } from "@/types/managementTypes";

export const useReviewData = (reviewId: string, enabled?: boolean): HookResult<Review> => {
    const reviewData = useGeneralData<Review>({
        fetchGeneralDataParams: {
            tableName: "reviews",
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

