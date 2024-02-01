"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { teamsPageNavigationMenuItems } from "@/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import WorkspaceTable from "@/components/lists/WorkspaceTable";
import dynamic from "next/dynamic";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useTeamsSearch } from "@/hooks/fetch/search-hooks/community/useUserTeamsSearch";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function TeamsPage() {
    // States
    const [teams, setTeams] = useState<GeneralInfo[]>([]);
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom hooks
    const teamsData = useTeamsSearch({
        extraFilters: { users: currentUserId },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (teamsData.status === "success" && teamsData?.data) {
            setTeams(
                teamsData.data.map((team) => ({
                    id: team.id,
                    icon: faFlask,
                    title: team.teamName,
                    users: team.users,
                    createdAt: team.createdAt,
                }))
            );
        }
    }, [teamsData.data]);

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Teams"}
                searchBarPlaceholder="Search teams..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
                refetch={teamsData.refetch}
            />
            <div className="w-full">
                <WorkspaceTable data={teams || []} isLoading={teamsData.isLoading} />
                <div className="flex justify-end my-4 mr-4">
                    {teamsData.totalCount && teamsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={teamsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>
            </div>

            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    {/* <CreateIssueForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    /> */}
                </div>
            )}
        </div>
    );
}
