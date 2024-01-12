import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { FeedbackResponse } from "@/types/resourcesTypes";

// TODO: Implement infinite query
export const useFeedbackResponses = (
    feedbackId: number,
    enabled?: boolean,
    initialData?: FetchResult<FeedbackResponse>
): HookResult<FeedbackResponse> => {
    const feedbackResponsesData = useGeneralData<FeedbackResponse>({
        fetchGeneralDataParams: {
            tableName: "feedback_responses",
            categories: [],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "created_at",
                    "content",
                    "feedback_id",
                    "users(id, username, full_name, avatar_url)",
                ],
                filters: {
                    feedback_id: Number(feedbackId),
                },
                page: 1,
                itemsPerPage: 10,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            initialData: initialData,
        },
    });

    return feedbackResponsesData;
};
