import { ProjectUpvote, UserCommunityActionsSmall } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../fetch/useGeneralData";


export const useUserCommunityActionsSmall = (userId: string, enabled?: boolean): HookResult<UserCommunityActionsSmall> => {
    const userActions = useGeneralData<UserCommunityActionsSmall>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [
                "project_upvotes",
                "bookmarks",
            ],
            options: {
                tableRowsIds: [userId],
                tableFields: ["id"],
                categoriesFetchMode: {
                    project_upvotes: "all",
                    bookmarks: "fields",
                },
                categoriesFields: {
                    bookmarks: ["id", "user_id", "object_type", "object_id"],
                },
                // categoriesFetchMode: {
                //     project_views: "fields",
                // }, 
                // categoriesFields: {
                //     project_views: ["project_id", "upvotin"]
                // }
            }
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        }
    });

    return userActions;
}