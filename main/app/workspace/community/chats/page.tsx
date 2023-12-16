"use client";

import React, { useState } from "react";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useTableUsers } from "@/hooks/utils/useTableUsers";
import { calculateDaysAgo } from "@/utils/functions";
import { useChatsSearch } from "@/hooks/fetch/search-hooks/community/useChatsSearch";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import ChatsList from "@/components/lists/community/ChatsList";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

// Same as Discussions, needs refactoring

export default function ChatsPage() {
    // States
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


    // Custom hooks
    const chatsData = useChatsSearch({
        extraFilters: { users: currentUserId },
        enabled:
            !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });
    console.log(chatsData);
    
    const chatIds =
        chatsData?.data.map((chat) => chat.id.toString()) || [];
    const {
        data: chatsUsers,
        error,
        isLoading,
    } = useTableUsers({
        objectIds: chatIds,
        tableName: "chat",
    });

    const userIdToUsernameMap: Record<string, string> = {};

    (chatsUsers || []).forEach((chatUser) => {
        chatUser.users.forEach((user) => {
            userIdToUsernameMap[user.id] = user.username;
        });
    });


    // Getting data ready for display
    let chats: ChatInfo[] = [];

    if (chatsData?.data && chatsUsers) {
        chats = chatsData.data.map((chat) => {
            const correspondingChatUsers =
                chatsUsers.find(
                    (chatUser) => chatUser.objectId === chat.id.toString()
                )?.users || [];

            const filteredUsers = correspondingChatUsers.filter(
                (user) => user.id !== currentUserId
            );

            let isLastMessageOwn = false;
            if (chat.chatMessages.length > 0) {
                isLastMessageOwn =
                    currentUserId ===
                    chat.chatMessages[chat.chatMessages.length - 1].userId;
            }

            let isGroup = filteredUsers.length > 1;
            let otherUserAvatarUrl = isGroup
                ? "/images/githublogo.png"
                : filteredUsers[0]?.avatarUrl || "/images/default-avatar.png";

            let lastMessageDaysAgo = "";
            if (
                (chat.chatMessages[chat.chatMessages.length - 1] || {})
                    .createdAt
            ) {
                lastMessageDaysAgo = calculateDaysAgo(
                    (chat.chatMessages[chat.chatMessages.length - 1] || {})
                        .createdAt || ""
                ).toString();
            }

            return {
                chatId: chat.id.toString() || "",
                title: chat.title,
                users: filteredUsers,
                lastMessage: (
                    chat.chatMessages[chat.chatMessages.length - 1] || {}
                ).content,
                isLastMessageOwn: isLastMessageOwn,
                otherUserAvatarUrl: otherUserAvatarUrl,
                lastMessageDaysAgo: lastMessageDaysAgo,
                createdAt: chat.createdAt,
                context: "chat",
            };
        });
    }

    if (chatsData.isLoading) {
        return (
            <div>
                <Skeleton className="w-[900px] h-[116px] bg-gray-50" />
            </div>
        );
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Chats"}
                searchBarPlaceholder="Search chats..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    {/* <CreateIssueForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    /> */}
                </div>
            )}
            <div className="w-full mt-2">
                    <ChatsList data={chats || []} disableNumbers={true} />
            </div>
            <div className="flex justify-end my-4 mr-4">
                {chatsData.totalCount &&
                    chatsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={chatsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
}
