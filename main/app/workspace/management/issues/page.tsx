"use client";

import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import GeneralList from "@/components/lists/GeneralList";
import { GeneralInfo } from "@/types/infoTypes";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import React, { useState } from "react";
import {
    issuesPageNavigationMenuItems,
    managementFilterNavigationMenuItems,
} from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { useAllUserIssuesSearch } from "@/hooks/fetch/search-hooks/management/useAllIssuesSearch";
import dynamic from "next/dynamic";
import { transformToIssuesInfo } from "@/transforms-to-ui-types/transformToIssuesInfo";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import { useUserId } from "@/contexts/current-user/UserIdContext";
const CreateIssueForm = dynamic(
    () => import("@/components/forms/CreateIssueForm")
);
const PageSelect = dynamic(
    () => import("@/components/complex-elements/PageSelect")
);

export default function IssuesPage() {
    // States
    // - Tab selections
    const [activeTab, setActiveTab] = useState<string>("Project Issues");
    const [activeSelection, setActiveSelection] = useState<string>("Yours");

    const handleActiveSelection = (activeSelection: string) => {
        setActiveSelection(activeSelection);
    };

    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    // Contexts
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;

    // - User
    const currentUserId = useUserId();

    // Custom hooks
    const {
        mergedProjectIssuesData,
        mergedWorkIssuesData,
        mergedReceivedProjectIssuesData,
        mergedReceivedWorkIssuesData,
        issuesProjects,
        issuesWorks,
        receivedIssuesProjects,
        receivedIssuesWorks,
    } = useAllUserIssuesSearch({
        userId: currentUserId,
        activeTab: activeTab,
        activeSelection: activeSelection,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    let projectIssues: GeneralInfo[] = [];
    let workIssues: GeneralInfo[] = [];
    let receivedProjectIssues: GeneralInfo[] = [];
    let receivedWorkIssues: GeneralInfo[] = [];

    if (mergedProjectIssuesData) {
        projectIssues = transformToIssuesInfo(
            mergedProjectIssuesData.data,
            issuesProjects,
            receivedIssuesProjects,
            issuesWorks,
            receivedIssuesWorks,
            false,
            "project_issues"
        );
    }
    if (mergedWorkIssuesData) {
        workIssues = transformToIssuesInfo(
            mergedWorkIssuesData.data,
            issuesProjects,
            receivedIssuesProjects,
            issuesWorks,
            receivedIssuesWorks,
            false,
            "work_issues"
        );
    }
    if (mergedReceivedProjectIssuesData) {
        receivedProjectIssues = transformToIssuesInfo(
            mergedReceivedProjectIssuesData.data,
            issuesProjects,
            receivedIssuesProjects,
            issuesWorks,
            receivedIssuesWorks,
            true,
            "project_issues"
        );
    }
    if (mergedReceivedWorkIssuesData) {
        receivedWorkIssues = transformToIssuesInfo(
            mergedReceivedWorkIssuesData.data,
            issuesProjects,
            receivedIssuesProjects,
            issuesWorks,
            receivedIssuesWorks,
            true,
            "work_issues"
        );
    }

    // Get refetch based on activeTab and activeSelection
    const getRefetchFunction = () => {
        if (activeTab === "Project Issues") {
            if (activeSelection === "Yours") {
                return mergedProjectIssuesData.refetch;
            } else if (activeSelection === "Received") {
                return mergedReceivedProjectIssuesData.refetch;
            }
        } else if (activeTab === "Work Issues") {
            if (activeSelection === "Yours") {
                return mergedWorkIssuesData.refetch;
            } else if (activeSelection === "Received") {
                return mergedReceivedWorkIssuesData.refetch;
            }
        }
    };
    
    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Issues"}
                searchBarPlaceholder="Search issues..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                refetch={getRefetchFunction()}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
            />
            <div className="flex items-center justify-between space-x-4 pt-4 w-full">
                <NavigationMenu
                    items={issuesPageNavigationMenuItems}
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
                    <CreateIssueForm
                        initialValues={{}}
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <div className="">
                {activeTab === "Project Issues" && (
                    <>
                        {activeSelection === "Yours" && (
                            <>
                                <GeneralList
                                    data={projectIssues || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType="issues"
                                    isLoading={
                                        mergedProjectIssuesData.isLoading
                                    }
                                    disableNumbers={true}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all issues!!*/}
                                    {projectIssues.length &&
                                    projectIssues.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                projectIssues?.length || 10
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
                                    data={receivedProjectIssues || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType="issues"
                                    isLoading={
                                        mergedReceivedProjectIssuesData.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all issues!!*/}
                                    {receivedProjectIssues.length &&
                                    receivedProjectIssues.length >=
                                        itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                receivedProjectIssues?.length ||
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
                {activeTab === "Work Issues" && (
                    <>
                        {activeSelection === "Yours" && (
                            <>
                                <GeneralList
                                    data={workIssues || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType="issues"
                                    isLoading={mergedWorkIssuesData.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all issues!!*/}
                                    {workIssues.length &&
                                    workIssues.length >= itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                workIssues?.length || 10
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
                                    data={receivedWorkIssues || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType="issues"
                                    isLoading={
                                        mergedReceivedWorkIssuesData.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {/* TODO: all issues!!*/}
                                    {receivedWorkIssues.length &&
                                    receivedWorkIssues.length >=
                                        itemsPerPage ? (
                                        <PageSelect
                                            numberOfElements={
                                                receivedWorkIssues?.length || 10
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
