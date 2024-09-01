"use client";

import React, { useState } from "react";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import DiscussionsList from "@/src/components/community/discussions/DiscussionList";
import { useDiscussionsSearch } from "@/src/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function DiscussionsPage() {
    // States
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 6;

    // Custom Hooks
    const discussionsData = useDiscussionsSearch({
        extraFilters: { user_id: currentUserId },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                refetch={discussionsData.refetch}
                className="border-b border-gray-200 shadow-sm"
            />
            <div className="w-full h-full bg-gray-100">
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
