import { Feedback } from "@/types/resourcesTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";

export const useFeedbackData = (
    feedbackId: number,
    initialData?: FetchResult<Feedback>,
    enabled?: boolean
): HookResult<Feedback> => {
    const feedbackData = useGeneralData<Feedback>({
        fetchGeneralDataParams: {
            tableName: "feedbacks",
            categories: [],
            options: {
                tableRowsIds: [feedbackId],
                tableFields: ["id", "created_at", "title", "content", "tags", "public", "users(id, username, full_name, avatar_url)"],
                page: 1,
                itemsPerPage: 5,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            initialData: initialData,
        },
    });

    return feedbackData;
};
