import { ProjectUpvote, UserCommunityActionsSmall } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../fetch/useGeneralData";


export const useUserCommunityActionsSmall = (userId: string, enabled?: boolean): HookResult<UserCommunityActionsSmall> => {
    const userActions = useGeneralData<UserCommunityActionsSmall>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [
                "project_upvotes",
                "bookmarks",
                "discussion_upvotes",
                "comment_upvotes"
            ],
            options: {
                tableRowsIds: [userId],
                tableFields: ["id"],
                categoriesFetchMode: {
                    project_upvotes: "all",
                    discussion_upvotes: "all",
                    comment_upvotes: "all",
                    bookmarks: "fields",
                },
                categoriesFields: {
                    bookmarks: ["id", "user_id", "object_type", "object_id"],
                },
            }
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
            staleTime: 600 * 1000,
        }
    });

    return userActions;
}