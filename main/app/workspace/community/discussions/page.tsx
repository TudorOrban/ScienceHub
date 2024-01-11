"use client";

import React, { useState } from "react";
import { discussionsPageNavigationMenuItems } from "@/config/navItems.config";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { calculateDaysAgo } from "@/utils/functions";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import NavigationMenu from "@/components/headers/NavigationMenu";
import DiscussionsList from "@/components/community/discussions/DiscussionList";
import { CommentInfo, DiscussionInfo } from "@/types/infoTypes";
import { useDiscussionsSearch } from "@/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { useDeleteGeneralObject } from "@/hooks/delete/useDeleteGeneralObject";
import dynamic from "next/dynamic";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { User } from "@/types/userTypes";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function DiscussionsPage() {
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
    const itemsPerPage = 1;

    // Custom Hooks
    const discussionsData = useDiscussionsSearch({
        extraFilters: { user_id: currentUserId },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                className="border-b border-gray-200 shadow-sm"
            />
            <div className="w-full h-full bg-gray-100 ">
                <DiscussionsList
                    discussions={discussionsData.data || []}
                    isLoading={discussionsData.isLoading}
                />
                <div className="pt-2 flex justify-end">
                    {discussionsData.totalCount && discussionsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={discussionsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
