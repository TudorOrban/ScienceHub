import React, { useRef } from "react";
import { Discussion, Comment } from "@/src/types/communityTypes";
import DiscussionActionBar from "./DiscussionActionBar";
import PostCommentBar from "./PostCommentBar";
import ContentCard from "./ContentCard";
import dynamic from "next/dynamic";
const CommentItem = dynamic(() => import("@/src/components/community/discussions/CommentItem"));

type DiscussionCardProps = {
    discussion: Discussion;
    comments?: Comment[];
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
    postCommentBarOff?: boolean;
    isLoading?: boolean;
};

/**
 * Component for displaying a full discussion. Used in dynamic route.
 */
const DiscussionCard: React.FC<DiscussionCardProps> = ({
    discussion,
    comments,
    fetchNextPage,
    hasNextPage,
    postCommentBarOff,
    isLoading,
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
            style={{ maxHeight: "calc(100vh - 64px)" }}
            className="bg-gray-100 overflow-y-auto p-4"
        >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200">
                <ContentCard
                    content={discussion}
                    discussionId={discussion?.id}
                    isDiscussion={true}
                    isLoading={isLoading}
                />
                {discussion?.id && !isLoading && (
                    <DiscussionActionBar discussion={discussion} comments={comments} />
                )}
                {discussion?.id && !isLoading && !postCommentBarOff && (
                    <PostCommentBar discussionId={discussion?.id} commentId={null} />
                )}
            </div>

            {comments?.map((comment) => (
                <CommentItem
                    key={comment.id}
                    discussionId={discussion?.id}
                    discussionUserUsername={discussion?.users?.username || ""}
                    comment={comment}
                />
            ))}
        </div>
    );
};

export default DiscussionCard;
