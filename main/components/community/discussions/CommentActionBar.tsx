import { useUserActionsContext } from "@/contexts/current-user/UserActionsContext";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { Comment } from "@/types/communityTypes";
import supabase from "@/utils/supabase";
import {
    faBookmark,
    faComment,
    faEllipsis,
    faRetweet,
    faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommentActionBarProps {
    discussionId: number;
    discussionUserUsername: string;
    comment: Comment;
    comments?: Comment[];
}

const CommentActionBar: React.FC<CommentActionBarProps> = ({
    discussionId,
    discussionUserUsername,
    comment,
    comments,
}) => {
    // States
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvotedCount] = useState<number>(0);

    // Contexts
    // - Navigation
    const pathname = usePathname();
    const router = useRouter();

    // - User contexts
    const {
        userActions
    } = useUserActionsContext();

    const currentUserId = useUserId();

    useEffect(() => {
        if (userActions.status === "success") {
            const upvote = userActions.data[0]?.commentUpvotes?.filter((upvote) => upvote.commentId === comment.id);
            setUpvoted((upvote?.length || 0) > 0);
        }
    }, [userActions.data]);

    useEffect(() => {
        const commUpvoteCount = comment?.commentUpvotes?.[0]?.count;
        if (commUpvoteCount && commUpvoteCount !== upvoteCount) {
            setUpvotedCount(commUpvoteCount);
        }
    }, [comment]);

    const handleNavigateToComment = (discussionId: number, discussionUserUsername: string, commentId: number) => {
        const url = `/${discussionUserUsername}/community/discussions/${discussionId}/comments/${commentId}`;
        if (pathname !== url) {
            router.push(url);
        }
    }

    const handleUpvoteComment = async (upvoted: boolean, commentId: number, userId: string | null | undefined) => {
        try {
            if (!userId) {
                console.error("No user id found!");
                return;
            }
            if (!upvoted) {
                const { error } = await supabase.from("comment_upvotes").insert({
                    user_id: userId,
                    comment_id: commentId,
                });

                if (error) {
                    console.error("An error occurred while upvoting comment: ", error);
                } else {
                    setUpvoted(true);
                    setUpvotedCount(upvoteCount + 1);
                }

            } else {
                const { error } = await supabase.from("comment_upvotes").delete().eq("comment_id", commentId);

                if (error) {
                    console.error("An error occurred while removing comment upvote: ", error);
                } else {
                    setUpvoted(false);
                    setUpvotedCount(upvoteCount - 1);
                }
            }
        } catch (error) {
            console.error("An error occurred while upvoting comment: ", error)
        }
    }

    return (
        <div className="flex justify-between items-center py-4 px-10 text-gray-600 border-y border-gray-300 rounded-b-md">
            <button onClick={() => handleNavigateToComment(discussionId, discussionUserUsername, comment.id)} className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                <FontAwesomeIcon icon={faComment} />
                <span>{comment.childrenCommentsCount || 0}</span>
            </button>
            <button onClick={() => handleUpvoteComment(upvoted, comment.id, currentUserId)} className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                <FontAwesomeIcon icon={faUpLong} className={`${upvoted ? "text-green-700" : ""}`}/>
                <span>{upvoteCount}</span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                <FontAwesomeIcon icon={faRetweet} />
                <span>{0}</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                <FontAwesomeIcon icon={faBookmark} />
                <span>{0}</span>
            </div>
            <FontAwesomeIcon icon={faEllipsis} />
        </div>
    );
};

export default CommentActionBar;
