"use client";

import React, { useState } from "react";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useTableUsers } from "@/hooks/utils/useTableUsers";
import { calculateDaysAgo } from "@/utils/functions";
import { useChatsSearch } from "@/hooks/fetch/search-hooks/community/useChatsSearch";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import ChatsList from "@/components/community/chats/ChatsList";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useObjectsWithUsers } from "@/hooks/fetch/search-hooks/works/useObjectsWithUsers";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
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
        enabled: !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });
    
    const mergedChats = useObjectsWithUsers({
        objectsData: chatsData,
        tableName: "chat",
        enabled: !!chatsData.data?.[0],
    })

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
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
                refetch={chatsData.refetch}
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
                <ChatsList chats={mergedChats.data} currentUserId={currentUserId || ""} isLoading={mergedChats.isLoading} />
                <div className="flex justify-end">
                    {chatsData.totalCount && chatsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={chatsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
