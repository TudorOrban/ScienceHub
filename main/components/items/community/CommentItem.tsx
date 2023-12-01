import React, { useContext } from "react";
import { formatDaysAgo } from "@/utils/functions";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faCaretDown,
    faCaretUp,
    faComment,
    faEllipsis,
    faHeart,
    faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import { CommentInfo } from "@/types/infoTypes";
import { DeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { useDeleteGeneralObject } from "@/app/hooks/delete/useDeleteGeneralObject";
import { useUserId } from "@/app/contexts/general/UserIdContext";
import dynamic from 'next/dynamic';
const ConfirmDialog = dynamic(() => import('@/components/elements/ConfirmDialog'));

type CommentItemProps = {
    commentInfo: CommentInfo;
    descendants: CommentInfo[];
    depth: number;
    onDeleteComment: (commentId: number) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
    commentInfo,
    descendants,
    depth,
    onDeleteComment,
}) => {
    const [showReplies, setShowReplies] = React.useState(false);
    const toggleReplies = () => setShowReplies(!showReplies);

    const immediateChildren = descendants.filter(
        (c) => String(c.parentCommentId) === commentInfo.id?.toString()
    );

    // Hooks
    const currentUserId = useUserId();;
    const deleteModeContext = useContext(DeleteModeContext);

    if (!deleteModeContext) {
        throw new Error("Delete mode context not available");
    }

    const {
        isDeleteModeOn,
        toggleDeleteMode,
        isConfirmDialogOpen,
        toggleConfirmDialog,
    } = deleteModeContext;
    
    const deleteGeneral = useDeleteGeneralObject("discussion_comments");

    return (
        <div className={`text-base`}>
            <div className="pl-4 pt-4">
                {commentInfo.user && (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {commentInfo.user.avatarUrl && (
                                <Image
                                    src={commentInfo.user.avatarUrl}
                                    alt="Picture of the user"
                                    width={64}
                                    height={64}
                                    className="w-10 h-10 rounded-full"
                                />
                            )}
                            <div className="ml-4">
                                {commentInfo.user.fullName}
                                <div className="text-sm text-gray-500">
                                    {commentInfo.daysAgo && (
                                        <span>
                                            {formatDaysAgo(
                                                Number(commentInfo.daysAgo)
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {immediateChildren.length > 0 && (
                                <button
                                    onClick={toggleReplies}
                                    className="ml-2 text-gray-900"
                                >
                                    {showReplies ? (
                                        <FontAwesomeIcon icon={faCaretUp} />
                                    ) : (
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="pr-4">
                            {isDeleteModeOn && (commentInfo.user.id === currentUserId) && (
                                <ConfirmDialog
                                    objectId={Number(commentInfo.id || 0)}
                                    onDelete={() =>
                                        deleteGeneral.handleDeleteObject(
                                            Number(commentInfo.id || 0)
                                        )
                                    }
                                    objectType={"Discussion Comment"}
                                />
                            )}
                        </div>
                    </div>
                )}
                <div className="mt-4 mb-4">
                    <span>{commentInfo.content}</span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-2 mx-20 text-gray-600">
                <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
                    <FontAwesomeIcon icon={faComment} />
                    <span>{immediateChildren.length || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-red-600">
                    <FontAwesomeIcon icon={faHeart} />
                    <span>{commentInfo.upvotesCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                    <FontAwesomeIcon icon={faRetweet} />
                    <span>{commentInfo.repostsCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-600">
                    <FontAwesomeIcon icon={faBookmark} />
                    <span>{commentInfo.bookmarksCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-600">
                    <FontAwesomeIcon icon={faEllipsis} />
                </div>
            </div>

            <div className={`mt-4 mb-4 ${showReplies ? "border-t border-gray-200" : ""}`}>
                {showReplies && (
                    <div style={{ marginLeft: "20px" }}>
                        {immediateChildren.map((child) => {
                            const childDescendants = descendants.filter(
                                (d) => d.id !== child.id
                            );

                            return (
                                <CommentItem
                                    key={child.id}
                                    commentInfo={child}
                                    descendants={childDescendants}
                                    depth={depth + 1}
                                    onDeleteComment={onDeleteComment}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
