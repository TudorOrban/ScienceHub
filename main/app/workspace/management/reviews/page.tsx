"use client";

import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import WorkspaceTable from "@/components/lists/WorkspaceTable";
import { GeneralInfo } from "@/types/infoTypes";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import {
    managementFilterNavigationMenuItems,
    reviewsPageNavigationMenuItems,
} from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useAllUserReviewsSearch } from "@/hooks/fetch/search-hooks/management/useAllUserReviewsSearch";
import { transformToReviewsInfo } from "@/transforms-to-ui-types/transformToReviewsInfo";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import { useUserId } from "@/contexts/current-user/UserIdContext";
const CreateReviewForm = dynamic(() => import("@/components/forms/CreateReviewForm"));
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function ReviewsPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Project Reviews");
    const [activeSelection, setActiveSelection] = useState<string>("Yours");
    const [createNewOn, setCreateNewOn] = React.useState<boolean>(false);

    // Contexts
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    const currentUserId = useUserId();

    // Custom hooks
    const {
        mergedProjectReviewsData,
        mergedWorkReviewsData,
        mergedReceivedProjectReviewsData,
        mergedReceivedWorkReviewsData,
        reviewsProjects,
        reviewsWorks,
        receivedReviewsProjects,
        receivedReviewsWorks,
    } = useAllUserReviewsSearch({
        userId: currentUserId,
        activeTab: activeTab,
        activeSelection: activeSelection,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    let projectReviews: GeneralInfo[] = [];
    let workReviews: GeneralInfo[] = [];
    let receivedProjectReviews: GeneralInfo[] = [];
    let receivedWorkReviews: GeneralInfo[] = [];

    if (mergedProjectReviewsData) {
        projectReviews = transformToReviewsInfo(
            mergedProjectReviewsData.data,
            reviewsProjects,
            receivedReviewsProjects,
            reviewsWorks,
            receivedReviewsWorks,
            false
        );
    }
    if (mergedWorkReviewsData) {
        workReviews = transformToReviewsInfo(
            mergedWorkReviewsData.data,
            reviewsProjects,
            receivedReviewsProjects,
            reviewsWorks,
            receivedReviewsWorks,
            false
        );
    }
    if (mergedReceivedProjectReviewsData) {
        receivedProjectReviews = transformToReviewsInfo(
            mergedReceivedProjectReviewsData.data,
            reviewsProjects,
            receivedReviewsProjects,
            reviewsWorks,
            receivedReviewsWorks,
            true
        );
    }
    if (mergedReceivedWorkReviewsData) {
        receivedWorkReviews = transformToReviewsInfo(
            mergedReceivedWorkReviewsData.data,
            reviewsProjects,
            receivedReviewsProjects,
            reviewsWorks,
            receivedReviewsWorks,
            true
        );
    }

    // Get refetch based on activeTab and activeSelection
    const getRefetchFunction = () => {
        if (activeTab === "Project Reviews") {
            if (activeSelection === "Yours") {
                return mergedProjectReviewsData.refetch;
            } else if (activeSelection === "Received") {
                return mergedReceivedProjectReviewsData.refetch;
            }
        } else if (activeTab === "Work Reviews") {
            if (activeSelection === "Yours") {
                return mergedWorkReviewsData.refetch;
            } else if (activeSelection === "Received") {
                return mergedReceivedWorkReviewsData.refetch;
            }
        }
    };

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Reviews"}
                searchBarPlaceholder="Search reviews..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                refetch={getRefetchFunction()}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
            />
            <div className="flex items-center justify-between space-x-4 pt-4 w-full">
                <NavigationMenu
                    items={reviewsPageNavigationMenuItems}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    className="border-b border-gray-300 flex-shrink flex-grow min-w-0"
                />
                <NavigationMenu
                    items={managementFilterNavigationMenuItems}
                    activeTab={activeSelection}
                    setActiveTab={setActiveSelection}
                    className="border-b border-gray-300 flex-shrink-0 ml-2 justify-end min-w-max"
                />
            </div>

            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateReviewForm
                        createNewOn={createNewOn}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
            <div className="w-full">
                {activeTab === "Project Reviews" && (
                    <>
                        {activeSelection === "Yours" && (
                            <>
                                <WorkspaceTable
                                    data={projectReviews || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType="reviews"
                                    isLoading={mergedProjectReviewsData.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {projectReviews.length &&
                                    projectReviews.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={projectReviews?.length || 10}
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                        {activeSelection === "Received" && (
                            <>
                                <WorkspaceTable
                                    data={receivedProjectReviews || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType="reviews"
                                    isLoading={mergedReceivedProjectReviewsData.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {receivedProjectReviews.length &&
                                    receivedProjectReviews.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={receivedProjectReviews?.length || 10}
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                    </>
                )}
                {activeTab === "Work Reviews" && (
                    <>
                        {activeSelection === "Yours" && (
                            <>
                                <WorkspaceTable
                                    data={workReviews || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType="reviews"
                                    isLoading={mergedWorkReviewsData.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {workReviews.length && workReviews.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={workReviews?.length || 10}
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                        {activeSelection === "Received" && (
                            <>
                                <WorkspaceTable
                                    data={receivedWorkReviews || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType="reviews"
                                    isLoading={mergedReceivedWorkReviewsData.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {receivedWorkReviews.length &&
                                    receivedWorkReviews.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={receivedWorkReviews?.length || 10}
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
