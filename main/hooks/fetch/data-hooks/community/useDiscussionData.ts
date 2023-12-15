import { Discussion } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useDiscussionData = (discussionId: string, enabled?: boolean): HookResult<Discussion> => {
    const discussionData = useGeneralData<Discussion>({
        fetchGeneralDataParams: {
            tableName: "discussions",
            categories: ["discussion_comments"],
            options: {
                tableRowsIds: [discussionId],
                tableFields: ["id", "created_at", "title", "users(id, username, full_name)", "content", "updated_at",],
                page: 1,
                itemsPerPage: 5,
                categoriesFetchMode: {
                    discussion_comments: "all",
                },
                
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        }
    });

    return discussionData;
};
