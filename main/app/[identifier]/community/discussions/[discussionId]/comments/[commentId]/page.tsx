"use client";

import { useDiscussionData } from "@/hooks/fetch/data-hooks/community/useDiscussionData";
import DiscussionCard from "@/components/community/discussions/DiscussionCard";
import { notFound } from "next/navigation";
import { useDiscussionComments } from "@/hooks/fetch/data-hooks/community/useDiscussionComments";
import { useEffect, useRef, useState } from "react";
import { Comment, SnakeCaseComment } from "@/types/communityTypes";
import supabase from "@/utils/supabase";
import { snakeCaseToCamelCase } from "@/services/fetch/fetchGeneralData";
import { useCommentData } from "@/hooks/fetch/data-hooks/community/useCommentData";
import CommentCard from "@/components/community/discussions/CommentCard";
import { User } from "@/types/userTypes";
// import { isDiscussionComment } from "../../page";

export default function CommentPage({
    params: { identifier, discussionId, commentId },
}: {
    params: { identifier: string; discussionId: string, commentId: string };
}) {
    // Local state for comments
    const [comments, setComments] = useState<Comment[]>([]);
    // Ref to store real-time comments
    const realTimeCommentsRef = useRef<Comment[]>([]);
    // Number of comments to fetch per page
    const itemsPerPage = 3;

    // Custom hooks
    const commentData = useCommentData(commentId, true);
    const comment = commentData?.data[0];

    // Infinite query hook for comment comments with infinite scrolling
    const { data, fetchNextPage, hasNextPage } = useDiscussionComments(
        Number(discussionId),
        Number(commentId),
        itemsPerPage,
        true
    );

    useEffect(() => {
        // Update local state with fetched and real-time comments
        const flatComments =
            data?.pages.flat().filter((comment): comment is Comment => comment !== undefined) || [];
            const mergedComments = mergeComments(flatComments, realTimeCommentsRef.current);
        setComments(mergedComments);
    }, [data]);

    useEffect(() => {
        // Subscribe to supabase real-time channel
        const commentCommentsSubscription = supabase
            .channel("comment_comments_changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "discussion_comments",
                    filter: `parent_comment_id=eq.${commentId}`,
                },
                async (payload) => {
                    if (
                        // isDiscussionComment(payload.new) &&
                        payload.new.user_id &&
                        payload.new.parent_comment_id === Number(commentId)
                    ) {
                        try {
                            // Fetch user details based on user_id from the payload
                            const { data: userData, error } = await supabase
                                .from("users")
                                .select("id, username, full_name, avatar_url")
                                .eq("id", payload.new.user_id)
                                .single();

                            if (error) throw error;

                            // Merge user data with the comment data
                            const newComment = {
                                ...snakeCaseToCamelCase<Comment>(payload.new as any),
                                users: snakeCaseToCamelCase<User>(userData as any),
                            };

                            // Update real-time comments ref
                            realTimeCommentsRef.current = [
                                newComment,
                                ...realTimeCommentsRef.current,
                            ];

                            // Update local state
                            setComments((currentComments) => {
                                return mergeComments(currentComments, [newComment]);
                            });
                        } catch (error) {
                            console.error("Error fetching user data for new comment: ", error);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            commentCommentsSubscription.unsubscribe();
        };
    }, [commentId]);

    if (!commentData.isLoading && commentData.data.length === 0) {
        notFound();
    }

    return (
        <CommentCard
            discussionId={Number(discussionId)}
            discussionUserUsername={identifier}
            comment={
                comment || {
                    user: { id: "", username: "", fullName: "" },
                }
            }
            comments={comments}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
        />
    );
}

// Helper function to merge and remove duplicates
function mergeComments(fetchedComments: Comment[], realTimeComments: Comment[]) {
    const merged = [...realTimeComments, ...fetchedComments];
    return merged.filter((cm, index, self) => index === self.findIndex((m) => m.id === cm.id));
}

// const uniqueUserIds = new Set<string>();
// if (commentData?.userId) {
//     uniqueUserIds.add(discussionData.userId?.toString());
// }
// discussionData?.discussionComments?.forEach((comment) => {
//     uniqueUserIds.add(comment.userId.toString());
// });

// const usersData = useUsersSmall(Array.from(uniqueUserIds), true);

// Getting data ready for display
// let discussion: DiscussionInfo | null = null;

// if (discussionData && usersData) {
//     const daysAgo =
//         calculateDaysAgo(discussionData.createdAt || "").toString() || "";

//     const transformedComments: CommentInfo[] =
//         discussionData.discussionComments?.map((comment) => {
//             const commentDaysAgo =
//                 calculateDaysAgo(comment.createdAt || "") || "";
//             const commentUser = usersData.data.find(
//                 (u) => u.id === comment.userId?.toString()
//             ) || {
//                 id: "",
//                 username: "",
//                 fullName: "",
//             };
//             return {
//                 id: comment.id,
//                 discussionId: (comment.discussionId || "").toString(),
//                 parentCommentId: comment.parentCommentId,
//                 content: comment.content,
//                 daysAgo: commentDaysAgo.toString(),
//                 user: commentUser,
//             };
//         }) || [];

//         let discussionUser: User = {
//             id: "",
//             username: "",
//             fullName: "",
//         };
//         if (discussionData.users) {
//             discussionUser = usersData.data.find(
//                 (user) => user.id === discussionData.users?.id.toString()
//             ) || {
//                 id: "",
//                 username: "",
//                 fullName: "",
//             };
//         }

//     discussion = {
//         discussionId: discussionData.id,
//         user: discussionUser,
//         title: discussionData.title,
//         createdAt: discussionData.createdAt,
//         content: discussionData.content,
//         discussionComments: transformedComments,
//         daysAgo,
//     };
// }

// if (discussionsData.serviceError || usersData.serviceError) {
//     return (
//         <div>
//             Error loading discussion:{" "}
//             {discussionsData.serviceError?.message ||
//                 usersData.serviceError?.message}
//         </div>
//     );
// }
