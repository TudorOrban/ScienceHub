"use client";

import { notFound } from "next/navigation";
import { useDiscussionComments } from "@/src/hooks/fetch/data-hooks/community/useDiscussionComments";
import { useEffect, useRef, useState } from "react";
import { Comment } from "@/src/types/communityTypes";
import supabase from "@/src/utils/supabase";
import { snakeCaseToCamelCase } from "@/src/services/fetch/fetchGeneralData";
import { useCommentData } from "@/src/hooks/fetch/data-hooks/community/useCommentData";
import CommentCard from "@/src/components/community/discussions/CommentCard";
import { User } from "@/src/types/userTypes";

export default function CommentPage({
    params: { identifier, discussionId, commentId },
}: {
    params: { identifier: string; discussionId: string, commentId: string };
}) {
    const itemsPerPage = 3;

    // State for existing comments
    const [comments, setComments] = useState<Comment[]>([]);
    // Ref for store real-time comments
    const realTimeCommentsRef = useRef<Comment[]>([]);

    // Hook for comment metadata
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
        // Update local state with existing and real-time comments
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

                            // Merge user data with the comment data and update ref
                            const newComment = {
                                ...snakeCaseToCamelCase<Comment>(payload.new as any),
                                users: snakeCaseToCamelCase<User>(userData as any),
                            };

                            realTimeCommentsRef.current = [
                                newComment,
                                ...realTimeCommentsRef.current,
                            ];

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

// Function to merge and remove duplicates
function mergeComments(fetchedComments: Comment[], realTimeComments: Comment[]) {
    const merged = [...realTimeComments, ...fetchedComments];
    return merged.filter((cm, index, self) => index === self.findIndex((m) => m.id === cm.id));
}