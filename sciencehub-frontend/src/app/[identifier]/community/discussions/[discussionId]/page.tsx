"use client";

import { useDiscussionData } from "@/src/hooks/fetch/data-hooks/community/useDiscussionData";
import DiscussionCard from "@/src/components/community/discussions/DiscussionCard";
import { notFound } from "next/navigation";
import { useDiscussionComments } from "@/src/hooks/fetch/data-hooks/community/useDiscussionComments";
import { useEffect, useRef, useState } from "react";
import { Comment, SnakeCaseComment } from "@/src/types/communityTypes";
import supabase from "@/src/utils/supabase";
import { snakeCaseToCamelCase } from "@/src/services/fetch/fetchGeneralData";
import { User } from "@/src/types/userTypes";

export default function DiscussionPage({
    params: { identifier, discussionId },
}: {
    params: { identifier: string; discussionId: string };
}) {
    const itemsPerPage = 5;

    // State for existing comments
    const [comments, setComments] = useState<Comment[]>([]);
    // Ref for real-time comments
    const realTimeCommentsRef = useRef<Comment[]>([]);

    // Hook to fetch discussion metadata
    const discussionData = useDiscussionData(discussionId, true);
    const discussion = discussionData?.data[0];

    // Infinite query hook for discussion comments with infinite scrolling
    const { data, fetchNextPage, hasNextPage } = useDiscussionComments(
        Number(discussionId),
        null,
        itemsPerPage,
        true
    );

    useEffect(() => {
        // Update local state with fetched and real-time comments
        const flatComments =
            data?.pages?.flat().filter((comment): comment is Comment => comment !== undefined) || [];
        const mergedComments = mergeComments(flatComments, realTimeCommentsRef.current);
        setComments(mergedComments);
    }, [data]);

    useEffect(() => {
        // Subscribe to supabase real-time channel
        const discussionCommentSubscription = supabase
            .channel("discussion_comment_changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "discussion_comments",
                    filter: `discussion_id=eq.${discussionId}`,
                },
                async (payload) => {
                    if (
                        // isDiscussionComment(payload.new) &&
                        payload.new.user_id &&
                        payload.new.parent_comment_id === null
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
            discussionCommentSubscription.unsubscribe();
        };
    }, [discussionId]);

    if (!discussionData.isLoading && discussionData.data.length === 0) {
        notFound();
    }

    return (
        <DiscussionCard
            discussion={
                discussion
            }
            comments={comments}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={discussionData.isLoading}
        />
    );
}

// export function isDiscussionComment(obj: any): obj is SnakeCaseComment {
//     return "id" in obj && "discussion_id" in obj && "user_id" in obj && "parent_comment_id" in obj && "children_comments_count" in obj;
// }

// Function to merge and remove duplicates
function mergeComments(fetchedComments: Comment[], realTimeComments: Comment[]) {
    const merged = [...realTimeComments, ...fetchedComments];
    return merged.filter((msg, index, self) => index === self.findIndex((m) => m.id === msg.id));
}
