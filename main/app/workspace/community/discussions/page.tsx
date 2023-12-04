"use client";

import React, { useState } from "react";
import { discussionsPageNavigationMenuItems } from "@/utils/navItems.config";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { calculateDaysAgo } from "@/utils/functions";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import NavigationMenu from "@/components/headers/NavigationMenu";
import DiscussionsList from "@/components/lists/community/DiscussionList";
import { CommentInfo, DiscussionInfo } from "@/types/infoTypes";
import { useDiscussionsSearch } from "@/app/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { useDeleteGeneralObject } from "@/app/hooks/delete/useDeleteGeneralObject";
import dynamic from "next/dynamic";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import { useUsersSmall } from "@/app/hooks/utils/useUsersSmall";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import { User } from "@/types/userTypes";
const PageSelect = dynamic(
    () => import("@/components/complex-elements/PageSelect")
);

// Needs real-time and UI changes (abandon one-page nesting)

export default function DiscussionsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Discussions");

    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    
    // Contexts
    // - Current user
    const currentUserId = useUserId();
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;


    // Custom Hooks
    const discussionsData = useDiscussionsSearch({
        extraFilters: { user_id: currentUserId },
        enabled:
            !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });
    // console.log(discussionsData);


    // Getting data ready for display
    const uniqueUserIds = new Set<string>();

    discussionsData?.data.forEach((discussion) => {
        if (discussion.userId) {
            uniqueUserIds.add(discussion.userId?.toString());
        }
        discussion.discussionComments?.forEach((comment) => {
            uniqueUserIds.add(comment.userId?.toString());
        });
    });

    const usersData = useUsersSmall(Array.from(uniqueUserIds), !!uniqueUserIds);

    // Preparing data for display
    let discussions: DiscussionInfo[] = [];

    if (discussionsData?.data && usersData.data) {
        discussions = discussionsData.data.map((discussion) => {
            const daysAgo = calculateDaysAgo(discussion.createdAt || "") || "";

            const transformedComments: CommentInfo[] =
                discussion.discussionComments?.map((comment) => {
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
                        itemType: "comments",
                        discussionId: (comment.discussionId || "").toString(),
                        parentCommentId: comment.parentCommentId,
                        content: comment.content,
                        daysAgo: (commentDaysAgo || 0).toString(),
                        user: commentUser,
                    };
                }) || [];

            let discussionUser: User = {
                id: "",
                username: "",
                fullName: "",
            };
            if (discussion.users) {
                discussionUser = usersData.data.find(
                    (user) => user.id === discussion.users?.id.toString()
                ) || {
                    id: "",
                    username: "",
                    fullName: "",
                };
            }

            return {
                id: discussion.id,
                itemType: "discussions",
                user: discussionUser,
                title: discussion.title,
                createdAt: discussion.createdAt,
                content: discussion.content,
                discussionComments: transformedComments,
                daysAgo: daysAgo.toString(),
            };
        });
    }

    const deleteGeneral = useDeleteGeneralObject("discussions");

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
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
                            onDeleteDiscussion={
                                deleteGeneral.handleDeleteObject
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
