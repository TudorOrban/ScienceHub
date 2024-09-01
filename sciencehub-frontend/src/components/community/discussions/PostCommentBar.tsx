import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import supabase from "@/src/utils/supabase";
import { useEffect, useRef, useState } from "react";

interface PostCommentBarProps {
    discussionId: number;
    commentId: number | null;
}

/**
 * Component for posting discussion comment.
 */
const PostCommentBar: React.FC<PostCommentBarProps> = ({ discussionId, commentId }) => {
    // States
    const [newComment, setNewComment] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Contexts
    const currentUserId = useUserId();

    useEffect(() => {
        adjustHeight();
    }, [newComment]);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    // Post comment handler
    // To be moved to backend
    const postComment = async (discussionId: number, parentCommentId: number | null, commentContent: string) => {
        if (commentContent.trim() === "") return;
        if (!currentUserId) {
            console.log("No current user id!");
            return;
        }

        const newCommentData = {
            discussion_id: discussionId,
            user_id: currentUserId,
            content: commentContent,
            parent_comment_id: parentCommentId,
            children_comments_count: 0,
        }

        const { error } = await supabase.from("discussion_comments").insert([newCommentData]);

        if (error) {
            console.log("Error posting the comment: ",error);
        } else {
            setNewComment("");
        }
    }


    return (
        <div className="w-full border-x border-gray-300 bg-gray-50">
            <textarea
                ref={textareaRef}
                id="newComment"
                placeholder="Add comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 focus:outline-none border border-gray-300 rounded-md shadow-sm overflow-y-hidden"
            />
            <div className="flex justify-end">
                <button onClick={() => postComment(discussionId, commentId, newComment)} className="standard-write-button">
                    Post Comment
                </button>
            </div>
        </div>
    );
};

export default PostCommentBar;
