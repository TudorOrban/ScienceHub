"use client";

import React, { useState } from "react";
import { discussionsPageNavigationMenuItems } from "@/config/navItems.config";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { calculateDaysAgo } from "@/utils/functions";
import NavigationMenu from "@/components/headers/NavigationMenu";
import DiscussionsList from "@/components/community/discussions/DiscussionList";
import { CommentInfo, DiscussionInfo } from "@/types/infoTypes";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { useDiscussionsSearch } from "@/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";

export default function DiscussionsPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Discussions");

    // Contexts
    const currentUserId = useUserId();
    const effectiveUserId =
        currentUserId || "794f5523-2fa2-4e22-9f2f-8234ac15829a";

    // Custom hooks
    const discussionsData = useDiscussionsSearch({
        extraFilters: {},
        enabled: activeTab === "Discussions",
        context: "Browse Discussions",
    });

    // Get discussions' and comments' users
    const uniqueUserIds = new Set<string>();
    discussionsData?.data.forEach((discussion) => {
        uniqueUserIds.add(discussion.userId.toString());
        discussion.discussionComments?.forEach((comment) => {
            uniqueUserIds.add(comment.userId.toString());
        });
    });

    const usersData = useUsersSmall(Array.from(uniqueUserIds));

    // Get data ready for display
    let discussions: DiscussionInfo[] = [];

    if (discussionsData?.data && usersData) {
        discussions = discussionsData.data.map((discussion) => {
            const daysAgo = calculateDaysAgo(discussion.createdAt || "") || "";

            // Comments
            const transformedComments: CommentInfo[] =
                discussion.discussionComments?.map((comment) => {
                    const commentDaysAgo =
                        calculateDaysAgo(comment.createdAt || "") || "";
                    const commentUser = usersData.data.find(
                        (u) => u.id === comment.userId.toString()
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
                        daysAgo: (commentDaysAgo || 0).toString(),
                        user: commentUser,
                    };
                }) || [];

            // User
            const discussionUser = usersData.data.find(
                (u) => u.id === discussion.userId.toString()
            ) || {
                id: "",
                username: "",
                fullName: "",
            };

            return {
                discussionId: discussion.id,
                user: discussionUser,
                title: discussion.title,
                createdAt: discussion.createdAt,
                content: discussion.content,
                discussionComments: transformedComments,
                daysAgo: daysAgo.toString(),
            };
        });
    }

    return (
        <div className="mt-20">
            <BrowseHeaderUI
                breadcrumb={true}
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                context={"Browse Discussions"}
            />
            <NavigationMenu
                items={discussionsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Discussions" && (
                    <div>
                        <DiscussionsList
                            data={discussions || []}
                            onDeleteDiscussion={() => {}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
