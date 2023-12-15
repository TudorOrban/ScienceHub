"use client";

import { useDiscussionData } from "@/hooks/fetch/data-hooks/community/useDiscussionData";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import DiscussionItem from "@/components/items/community/DiscussionItem";
import { CommentInfo, DiscussionInfo } from "@/types/infoTypes";
import { User } from "@/types/userTypes";
import { calculateDaysAgo } from "@/utils/functions";
// // app/[identifier]/[projectId]/page.tsx
//
// export async function generateStaticParams() {
//     // Example arrays, replace these with actual fetched identifiers and projectIds
//     const identifiers = ['user1', 'team1'];
//     const projectIds = ['proj1', 'proj2'];

//     // Generate combinations of identifiers and projectIds
//     return identifiers.flatMap(identifier =>
//       projectIds.map(projectId => ({ identifier, projectId }))
//     );
//   }

export default function DiscussionPage({
    params,
}: {
    params: { identifier: string; discussionId: string };
}) {
    const { identifier, discussionId } = params;

    // Custom hooks
    const discussionsData = useDiscussionData(discussionId, true);
    const discussionData = discussionsData?.data[0];
    console.log("DISCUSSIONDATA", discussionsData);

    const uniqueUserIds = new Set<string>();
    if (discussionData?.userId) {
        uniqueUserIds.add(discussionData.userId?.toString());
    }
    discussionData?.discussionComments?.forEach((comment) => {
        uniqueUserIds.add(comment.userId.toString());
    });

    const usersData = useUsersSmall(Array.from(uniqueUserIds), true);

    // Getting data ready for display
    let discussion: DiscussionInfo | null = null;

    if (discussionData && usersData) {
        const daysAgo =
            calculateDaysAgo(discussionData.createdAt || "").toString() || "";

        const transformedComments: CommentInfo[] =
            discussionData.discussionComments?.map((comment) => {
                const commentDaysAgo =
                    calculateDaysAgo(comment.createdAt || "") || "";
                const commentUser = usersData.data.find(
                    (u) => u.id === comment.userId?.toString()
                ) || {
                    id: "",
                    username: "",
                    fullName: "",
                };
                return {
                    id: comment.id,
                    discussionId: (comment.discussionId || "").toString(),
                    parentCommentId: comment.parentCommentId,
                    content: comment.content,
                    daysAgo: commentDaysAgo.toString(),
                    user: commentUser,
                };
            }) || [];

            let discussionUser: User = {
                id: "",
                username: "",
                fullName: "",
            };
            if (discussionData.users) {
                discussionUser = usersData.data.find(
                    (user) => user.id === discussionData.users?.id.toString()
                ) || {
                    id: "",
                    username: "",
                    fullName: "",
                };
            }

        discussion = {
            discussionId: discussionData.id,
            user: discussionUser,
            title: discussionData.title,
            createdAt: discussionData.createdAt,
            content: discussionData.content,
            discussionComments: transformedComments,
            daysAgo,
        };
    }

    if (discussionsData.serviceError || usersData.serviceError) {
        return (
            <div>
                Error loading discussion:{" "}
                {discussionsData.serviceError?.message ||
                    usersData.serviceError?.message}
            </div>
        );
    }

    if (usersData.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <DiscussionItem
                discussionInfo={
                    discussion || {
                        user: { id: "", username: "", fullName: "" },
                    }
                }
                onDeleteDiscussion={() => {}}
            />
        </div>
    );
}
