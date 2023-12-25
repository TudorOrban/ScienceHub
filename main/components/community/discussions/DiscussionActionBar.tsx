import { useUserActionsContext } from "@/contexts/current-user/UserActionsContext";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import { Discussion, Comment } from "@/types/communityTypes";
import supabase from "@/utils/supabase";
import {
    faBookmark,
    faComment,
    faEllipsis,
    faRetweet,
    faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface DiscussionActionBarProps {
    discussion: Discussion;
    comments?: Comment[];
}

// TODO: Reposts and bookmarks
const DiscussionActionBar: React.FC<DiscussionActionBarProps> = ({
    discussion,
    comments,
}) => {
    // States
    const [upvoted, setUpvoted] = useState<boolean>(false);
    const [upvoteCount, setUpvotedCount] = useState<number>(0);

    // Contexts
    // - User
    const { userActions } = useUserActionsContext();
    const { userSmall } = useUserSmallDataContext();

    useEffect(() => {
        if (userActions.status === "success") {
            const upvote = userActions.data[0]?.discussionUpvotes?.filter(
                (upvote) => upvote.discussionId === discussion.id
            );
            setUpvoted((upvote?.length || 0) > 0);
        }
    }, [userActions.data]);

    useEffect(() => {
        const discUpvoteCount = discussion?.discussionUpvotes?.[0]?.count;
        if (discUpvoteCount && discUpvoteCount !== upvoteCount) {
            setUpvotedCount(discUpvoteCount);
        }
    }, [discussion]);

    const handleUpvoteDiscussion = async (
        upvoted: boolean,
        discussionId: number,
        userId: string | null | undefined
    ) => {
        try {
            if (!userId) {
                console.error("No user id found!");
                return;
            }
            if (!upvoted) {
                const { error } = await supabase.from("discussion_upvotes").insert({
                    user_id: userId,
                    discussion_id: discussionId,
                });

                if (error) {
                    console.error("An error occurred while upvoting discussion: ", error);
                } else {
                    console.log("OEWQIWQ");
                    setUpvoted(true);
                    setUpvotedCount(upvoteCount + 1);
                }
            } else {
                const { error } = await supabase
                    .from("discussion_upvotes")
                    .delete()
                    .eq("discussion_id", discussionId);

                if (error) {
                    console.error("An error occurred while removing discussion upvote: ", error);
                } else {
                    setUpvoted(false);
                    setUpvotedCount(upvoteCount - 1);
                }
            }
        } catch (error) {
            console.error("An error occurred while upvoting discussion: ", error);
        }
    };

    return (
        <div className="flex justify-between items-center py-4 px-10 text-gray-600 border-y border-gray-300 rounded-b-md">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900">
                <FontAwesomeIcon icon={faComment} />
                <span>{comments?.length || 0}</span>
            </div>
            <button
                onClick={() => handleUpvoteDiscussion(upvoted, discussion.id, userSmall.data[0].id)}
                className="flex items-center space-x-2 cursor-pointer hover:text-gray-900"
            >
                <FontAwesomeIcon icon={faUpLong} className={`${upvoted ? "text-green-700" : ""}`} />
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

export default DiscussionActionBar;
