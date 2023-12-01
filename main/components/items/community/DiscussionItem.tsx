import { formatDaysAgo } from "@/utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import useIdentifier from "@/app/hooks/utils/useIdentifier";
import {
    faBookmark,
    faComment,
    faEllipsis,
    faHeart,
    faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import { DiscussionInfo } from "@/types/infoTypes";
import { DeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import dynamic from 'next/dynamic';
const ConfirmDialog = dynamic(() => import('@/components/elements/ConfirmDialog'));
const CommentList = dynamic(() => import('@/components/lists/community/CommentList'));


type DiscussionItemProps = {
    discussionInfo: DiscussionInfo;
    onDeleteDiscussion: (discussionId: number) => void;
};

const DiscussionItem: React.FC<DiscussionItemProps> = ({
    discussionInfo,
    onDeleteDiscussion,
}) => {
    const router = useRouter();

    const { identifier, error, isLoading } = useIdentifier(
        [discussionInfo.user.id] || [],
        []
    );

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

    const navigateToDiscussion = () => {
        router.push(
            `/${identifier}/community/discussions/${discussionInfo.id}`
        );
    };

    const navigateToProfile = (userId: string) => {
        router.push(`/${identifier}/profile`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md m-4 border border-gray-200 transition-shadow duration-200">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center ">
                    {discussionInfo.user.avatarUrl && (
                        <Image
                            src={discussionInfo.user.avatarUrl}
                            alt="Picture of the user"
                            width={64}
                            height={64}
                            className="w-12 h-12 rounded-full"
                        />
                    )}
                    <div className="ml-4">
                        <span
                            className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateToProfile(discussionInfo.user.username);
                            }}
                        >
                            {discussionInfo.user.fullName}
                        </span>
                        <div className="text-sm text-gray-500">
                            {discussionInfo.daysAgo && (
                                <span>
                                    {formatDaysAgo(
                                        Number(discussionInfo.daysAgo)
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {isDeleteModeOn && (
                    <ConfirmDialog
                        objectId={Number(discussionInfo.id || 0)}
                        onDelete={() =>
                            onDeleteDiscussion(Number(discussionInfo.id || 0))
                        }
                        objectType={"discussion"}
                    />
                )}
            </div>
            <div className="px-4 cursor-pointer" onClick={navigateToDiscussion}>
                {discussionInfo.title && (
                    <h2 className="font-semibold text-xl mt-2">
                        {discussionInfo.title}
                    </h2>
                )}
                {discussionInfo.content && (
                    <p className="text-base mt-2">{discussionInfo.content}</p>
                )}
            </div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mt-4 mb-4 mx-10 text-gray-600">
                <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
                    <FontAwesomeIcon icon={faComment} />
                    <span>
                        {
                            discussionInfo.discussionComments?.filter(
                                (comment) => comment.parentCommentId === null
                            ).length
                        }
                    </span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-red-600">
                    <FontAwesomeIcon icon={faHeart} />
                    <span>{discussionInfo.upvotesCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-green-600">
                    <FontAwesomeIcon icon={faRetweet} />
                    <span>{discussionInfo.repostsCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-600">
                    <FontAwesomeIcon icon={faBookmark} />
                    <span>{discussionInfo.bookmarksCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-600">
                    <FontAwesomeIcon icon={faEllipsis} />
                </div>
            </div>
            <div className="border-t border-gray-300">
                {discussionInfo.discussionComments && (
                    <div className="">
                        <CommentList
                            commentsInfo={discussionInfo.discussionComments}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionItem;
