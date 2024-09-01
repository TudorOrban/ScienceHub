import supabase from "@/src/utils/supabase";
import { snakeCaseToCamelCase } from "../fetchGeneralData";
import { Comment, SnakeCaseComment } from "@/src/types/communityTypes";
import { SnakeCaseObject } from "../fetchGeneralDataAdvanced";

export const fetchDiscussionComments = async (
    discussionId: number,
    parentCommentId: number | null,
    page: number,
    itemsPerPage: number
) => {
    let query = supabase
        .from("discussion_comments")
        .select(
            "id, discussion_id, created_at, parent_comment_id, content, children_comments_count, users!discussion_comments_user_id_fkey(id, username, full_name, avatar_url), comment_upvotes(count)"
        )
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: false });

    if (parentCommentId !== null) {
        query = query.eq("parent_comment_id", parentCommentId);
    } else {
        query = query.is("parent_comment_id", null);
    }

    const { data, error } = await query.range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
   

    if (error || !data) {
        console.log("Error fetching discussion comments: ", error);
        return;
    }

    // TODO: fix the any
    return snakeCaseToCamelCase<Comment[]>(data as any);
};
