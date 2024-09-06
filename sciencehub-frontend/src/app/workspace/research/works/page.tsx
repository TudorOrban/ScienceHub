"use client";

import React, { useState } from "react";
import { Experiment, Work, WorkTypeNew } from "@/src/types/workTypes";
import { worksPageNavigationMenuItems } from "@/src/config/navItems.config";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { GeneralInfo } from "@/src/types/infoTypes";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { useAllUserWorks } from "@/src/hooks/fetch/search-hooks/works/useAllWorks";
import { worksAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { transformWorkToWorkInfo } from "@/src/utils/transforms-to-ui-types/transformWorkToWorkInfo";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import { useSearchUserWorks } from "@/src/hooks/fetch/search-hooks/works/useSearchUserWorksNew";
const CreateWorkForm = dynamic(() => import("@/src/components/forms/CreateWorkForm"));
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function WorksPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Papers");
    const [createNewOn, setCreateNewOn] = React.useState<boolean>(false);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [sortOption, setSortOption] = React.useState<string>("createdAt");
    const [sortDescending, setSortDescending] = React.useState<boolean>(false);

    // Contexts
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    const currentUserId = useUserId();

    // Custom Hooks
    const worksData = useSearchUserWorks({
        entityId: currentUserId ?? "",
        enabled: !!currentUserId,
        searchQuery: searchQuery,
        sortBy: sortOption,
        sortDescending: sortDescending,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    }, WorkTypeNew.Paper);


    // Preparing data for display
    let works: GeneralInfo[] = [];

    if (worksData?.data) {
        works = worksData.data?.results.map((work) => {
            return transformWorkToWorkInfo(work, undefined);
        });
    }

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Works"}
                searchBarPlaceholder="Search works..."
                sortOptions={worksAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
            />
            <NavigationMenu
                items={worksPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-300 pt-4"
            />
            <div className="w-full z-20">
                <div>
                    <WorkspaceTable
                        data={worksData.data.results || []}
                        columns={["Title", "Users", "Project"]}
                        itemType="experiments"
                        isLoading={worksData.isLoading}
                        isSuccess={worksData.error === undefined}
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {worksData.data?.totalCount &&
                            worksData.data?.totalCount >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={worksData.data?.totalCount || 10}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            </div>

            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateWorkForm
                        createNewOn={createNewOn}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
        </div>
    );
}
