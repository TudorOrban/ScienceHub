import { Comment } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useCommentData = (
    commentId: string,
    enabled?: boolean
): HookResult<Comment> => {
    const commentData = useGeneralData<Comment>({
        fetchGeneralDataParams: {
            tableName: "discussion_comments",
            categories: ["comment_upvotes"],
            options: {
                tableRowsIds: [commentId],
                tableFields: [
                    "id",
                    "discussion_id",
                    "created_at",
                    "content",
                    "children_comments_count",
                    "parent_comment_id",
                    "link",
                    "users!discussion_comments_user_id_fkey(id, username, full_name, avatar_url)"
                ],
                categoriesFetchMode: {
                    comment_upvotes: "count",
                },
                page: 1,
                itemsPerPage: 5,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    return commentData;
};
