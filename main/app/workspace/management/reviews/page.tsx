"use client";

import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import GeneralList from "@/components/lists/GeneralList";
import { GeneralInfo } from "@/types/infoTypes";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { usePageSelectContext } from "@/app/contexts/general/PageSelectContext";
import {
    managementFilterNavigationMenuItems,
    reviewsPageNavigationMenuItems,
} from "@/utils/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";
import { useAllReviewsSearch } from "@/app/hooks/fetch/search-hooks/management/useAllReviewsSearch";
import { transformToReviewsInfo } from "@/transforms-to-ui-types/transformToReviewsInfo";
const CreateReviewForm = dynamic(
    () => import("@/components/forms/CreateReviewForm")
);
const PageSelect = dynamic(
    () => import("@/components/complex-elements/PageSelect")
);

export default function ReviewsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Project Reviews");
    const [activeSelection, setActiveSelection] = useState<string>("Yours");

    // - Create
    const [createNewOn, setCreateNewOn] = React.useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    // Contexts
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;

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
    } = useAllReviewsSearch({
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

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Reviews"}
                searchBarPlaceholder="Search reviews..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                refetch={getRefetchFunction()}
                onCreateNew={onCreateNew}
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
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <div className="w-full">
                {activeTab === "Project Reviews" && (
                    <>
                        {activeSelection === "Yours" && (
                            <>
                                <GeneralList
                                    data={projectReviews || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType="reviews"
                                    isLoading={
                                        mergedProjectReviewsData.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all reviews!!*/}
                                    {projectReviews.length &&
                                    projectReviews.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                projectReviews?.length || 10
                                            }
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                        {activeSelection === "Received" && (
                            <>
                                <GeneralList
                                    data={receivedProjectReviews || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType="reviews"
                                    isLoading={
                                        mergedReceivedProjectReviewsData.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all reviews!!*/}
                                    {receivedProjectReviews.length &&
                                    receivedProjectReviews.length >=
                                        itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                receivedProjectReviews?.length ||
                                                10
                                            }
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
                                <GeneralList
                                    data={workReviews || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType="reviews"
                                    isLoading={mergedWorkReviewsData.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all reviews!!*/}
                                    {workReviews.length &&
                                    workReviews.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                workReviews?.length || 10
                                            }
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                        {activeSelection === "Received" && (
                            <>
                                <GeneralList
                                    data={receivedWorkReviews || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType="reviews"
                                    isLoading={
                                        mergedReceivedWorkReviewsData.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all reviews!!*/}
                                    {receivedWorkReviews.length &&
                                    receivedWorkReviews.length >=
                                        itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                receivedWorkReviews?.length ||
                                                10
                                            }
                                            itemsPerPage={itemsPerPage}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                    </>
                )}
                {/* {activeTab === "Submission Issues" && (
                    <div>
                        <GeneralList
                            data={submissionIssues || []}
                            itemType="Submission Issue"
                            isLoading={issuesData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                           
                            {submissionIssues.length &&
                            submissionIssues.length >= itemsPerPage ? (
                                <PageSelect
                                    numberOfElements={
                                        submissionIssues?.length || 10
                                    }
                                    itemsPerPage={itemsPerPage}
                                />
                            ) : null}
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
}
