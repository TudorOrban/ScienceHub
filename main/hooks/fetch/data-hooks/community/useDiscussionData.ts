import { Discussion } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useDiscussionData = (
    discussionId: string,
    enabled?: boolean
): HookResult<Discussion> => {
    const discussionData = useGeneralData<Discussion>({
        fetchGeneralDataParams: {
            tableName: "discussions",
            categories: ["discussion_upvotes"],
            options: {
                tableRowsIds: [discussionId],
                tableFields: [
                    "id",
                    "created_at",
                    "title",
                    "content",
                    "updated_at",
                    "users!discussions_user_id_fkey(id, username, full_name, avatar_url)"
                ],
                categoriesFetchMode: {
                    discussion_upvotes: "count",
                },
                page: 1,
                itemsPerPage: 5,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    return discussionData;
};
