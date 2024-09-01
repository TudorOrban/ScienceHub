import React from "react";
import { Comment } from "@/src/types/communityTypes";
import ContentCard from "@/src/components/community/discussions/ContentCard";
import CommentActionBar from "@/src/components/community/discussions/CommentActionBar";

type CommentItemProps = {
    discussionId: number;
    discussionUserUsername: string;
    comment: Comment;
};

/**
 * Component for displaying a discussion comment. Used in both DiscussionCard.
 */
const CommentItem: React.FC<CommentItemProps> = ({
    discussionId,
    discussionUserUsername,
    comment,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-0.5">
            <ContentCard content={comment} discussionId={discussionId} isDiscussion={false} />
            <CommentActionBar
                discussionId={discussionId}
                discussionUserUsername={discussionUserUsername}
                comment={comment}
            />
        </div>
    );
};

export default CommentItem;
