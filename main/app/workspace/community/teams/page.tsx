"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { teamsPageNavigationMenuItems } from "@/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import GeneralList from "@/components/lists/GeneralList";
import dynamic from "next/dynamic";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useTeamsSearch } from "@/hooks/fetch/search-hooks/community/useUserTeamsSearch";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function TeamsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Teams");

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
    const teamsData = useTeamsSearch({
        extraFilters: { users: currentUserId },
        enabled:
            !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });
    console.log(teamsData);


    // Getting data ready for display
    let teams: GeneralInfo[] = [];

    if (teamsData?.data) {
        teams = teamsData.data.map((team) => ({
            id: team.id,
            icon: faFlask,
            title: team.teamName,
            users: team.users,
            createdAt: team.createdAt,
        }));
    }
    
    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Teams"}
                searchBarPlaceholder="Search teams..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
            />
            <NavigationMenu
                items={teamsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    {/* <CreateIssueForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    /> */}
                </div>
            )}
            <div className="w-full">
                {activeTab === "Teams" && (
                    <div>
                        <GeneralList data={teams || []} isLoading={teamsData.isLoading}/>
                    </div>
                )}
            </div>
            <div className="flex justify-end my-4 mr-4">
                {teamsData.totalCount &&
                    teamsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={teamsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
}
