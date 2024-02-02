import React, { useRef } from "react";
import { Discussion, Comment } from "@/types/communityTypes";
import CommentActionBar from "./CommentActionBar";
import PostCommentBar from "./PostCommentBar";
import ContentCard from "./ContentCard";
import CommentItem from "@/components/community/discussions/CommentItem";

type CommentCardProps = {
    discussionId: number;
    discussionUserUsername: string;
    comment: Comment;
    comments?: Comment[];
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
};

/**
 * Component for displaying a full discussion comment. Used in dynamic route.
 */
const CommentCard: React.FC<CommentCardProps> = ({
    discussionId,
    discussionUserUsername,
    comment,
    comments,
    fetchNextPage,
    hasNextPage,
}) => {
    // Ref for the comments list container
    const commentsListRef = useRef<HTMLDivElement>(null);

    // Handle scrolling
    const handleScroll = () => {
        if (commentsListRef.current) {
            if (isScrolledToBottom() && hasNextPage) {
                fetchNextPage?.();
            }
        }
    };
    // Check if comments list is scrolled to the bottom
    const isScrolledToBottom = () => {
        if (!commentsListRef.current) return false;

        const { scrollTop, scrollHeight, clientHeight } = commentsListRef.current;
        return scrollTop + clientHeight >= scrollHeight - 60;
    };

    return (
        <div
            ref={commentsListRef}
            onScroll={handleScroll}
            style={{ height: "calc(100vh - 64px)" }}
            className="bg-gray-100 overflow-y-auto p-4"
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200">
                <ContentCard content={comment} discussionId={discussionId} isDiscussion={false} />
                <CommentActionBar
                    discussionId={discussionId}
                    discussionUserUsername={discussionUserUsername}
                    comment={comment}
                    comments={comments}
                />
                <PostCommentBar discussionId={discussionId} commentId={comment.id} />
            </div>
            {comments?.map((comment) => (
                <CommentItem
                    key={comment.id}
                    discussionId={discussionId}
                    discussionUserUsername={discussionUserUsername}
                    comment={comment}
                />
            ))}
        </div>
    );
};

export default CommentCard;
