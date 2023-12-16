"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import {
    managementFilterNavigationMenuItems,
    submissionsPageNavigationMenuItems,
} from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import GeneralList from "@/components/lists/GeneralList";
import { useAllSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useAllSubmissions";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { transformToSubmissionsInfo } from "@/transforms-to-ui-types/transformToSubmissionsInfo";

const CreateSubmissionForm = dynamic(
    () => import("@/components/forms/CreateSubmissionForm")
);
const PageSelect = dynamic(
    () => import("@/components/complex-elements/PageSelect")
);

export default function SubmissionsPage() {
    // States
    // - Tab selections
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");
    const [activeSelection, setActiveSelection] = useState<string>("Yours");

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

    // Custom Submissions hook
    const {
        mergedProjectSubmissions,
        mergedWorkSubmissions,
        mergedProjectSubmissionRequests,
        mergedWorkSubmissionRequests,
        submissionsProjects,
        submissionsWorks,
        submissionRequestsProjects,
        submissionRequestsWorks,
    } = useAllSubmissionsSearch({
        activeTab: activeTab,
        activeSelection: activeSelection,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });


    // Preparing data for display
    let projectSubmissions: GeneralInfo[] = [];
    let workSubmissions: GeneralInfo[] = [];
    let projectSubmissionRequests: GeneralInfo[] = [];
    let workSubmissionRequests: GeneralInfo[] = [];

    if (mergedProjectSubmissions) {
        projectSubmissions = transformToSubmissionsInfo(
            mergedProjectSubmissions.data || [],
            submissionsProjects,
            submissionRequestsProjects,
            submissionsWorks,
            submissionRequestsWorks,
            false,
            "project_submissions"
        );
    }
    if (mergedWorkSubmissions) {
        workSubmissions = transformToSubmissionsInfo(
            mergedWorkSubmissions.data || [],
            submissionsProjects,
            submissionRequestsProjects,
            submissionsWorks,
            submissionRequestsWorks,
            false,
            "work_submissions"
        );
    }
    if (mergedProjectSubmissionRequests) {
        projectSubmissionRequests = transformToSubmissionsInfo(
            mergedProjectSubmissionRequests.data || [],
            submissionsProjects,
            submissionRequestsProjects,
            submissionsWorks,
            submissionRequestsWorks,
            true,
            "project_submissions"
        );
    }
    if (mergedWorkSubmissionRequests) {
        workSubmissionRequests = transformToSubmissionsInfo(
            mergedWorkSubmissionRequests.data || [],
            submissionsProjects,
            submissionRequestsProjects,
            submissionsWorks,
            submissionRequestsWorks,
            true,
            "work_submissions"
        );
    }


    // Get refetch based on activeTab and activeSelection
    const getRefetchFunction = () => {
        if (activeTab === "Project Submissions") {
            if (activeSelection === "Yours") {
                return mergedProjectSubmissions.refetch;
            } else if (activeSelection === "Received") {
                return mergedProjectSubmissionRequests.refetch;
            }
        } else if (activeTab === "Work Submissions") {
            if (activeSelection === "Yours") {
                return mergedWorkSubmissions.refetch;
            } else if (activeSelection === "Received") {
                return mergedWorkSubmissionRequests.refetch;
            }
        }
    };

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Submissions"}
                searchBarPlaceholder="Search submissions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                refetch={getRefetchFunction()}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
            />
            <div className="flex items-center justify-between space-x-4 pt-4 w-full">
                <NavigationMenu
                    items={submissionsPageNavigationMenuItems}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    className="border-b border-gray-300 flex-shrink flex-grow min-w-0"
                />
                <NavigationMenu
                    items={managementFilterNavigationMenuItems}
                    activeTab={activeSelection}
                    setActiveTab={setActiveSelection}
                    className="border-b border-gray-200 flex-shrink-0 ml-2 justify-end min-w-max"
                />
            </div>
            <div className="w-full">
                {activeTab === "Project Submissions" && (
                    <>
                        {activeSelection === "Yours" && (
                            <div>
                                <GeneralList
                                    data={projectSubmissions || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType={"project_submissions"}
                                    isLoading={
                                        mergedProjectSubmissions.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedProjectSubmissions.totalCount &&
                                        mergedProjectSubmissions.totalCount >=
                                            itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedProjectSubmissions?.totalCount ||
                                                    10
                                                }
                                                itemsPerPage={itemsPerPage}
                                            />
                                        )}
                                </div>
                            </div>
                        )}
                        {activeSelection === "Received" && (
                            <div>
                                <GeneralList
                                    data={projectSubmissionRequests || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType={"project_submissions"}
                                    isLoading={
                                        mergedProjectSubmissionRequests.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedProjectSubmissionRequests.totalCount &&
                                        mergedProjectSubmissionRequests.totalCount >=
                                            itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedProjectSubmissionRequests?.totalCount ||
                                                    10
                                                }
                                                itemsPerPage={itemsPerPage}
                                            />
                                        )}
                                </div>
                            </div>
                        )}
                    </>
                )}
                {activeTab === "Work Submissions" && (
                    <>
                        {activeSelection === "Yours" && (
                            <div>
                                <GeneralList
                                    data={workSubmissions || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType={"work_submissions"}
                                    isLoading={mergedWorkSubmissions.isLoading}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedWorkSubmissions.totalCount &&
                                        mergedWorkSubmissions.totalCount >=
                                            itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedWorkSubmissions?.totalCount ||
                                                    10
                                                }
                                                itemsPerPage={itemsPerPage}
                                            />
                                        )}
                                </div>
                            </div>
                        )}
                        {activeSelection === "Received" && (
                            <div>
                                <GeneralList
                                    data={workSubmissionRequests || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType={"work_submissions"}
                                    isLoading={
                                        mergedWorkSubmissionRequests.isLoading
                                    }
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedWorkSubmissionRequests.totalCount &&
                                        mergedWorkSubmissionRequests.totalCount >=
                                            itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedWorkSubmissionRequests?.totalCount ||
                                                    10
                                                }
                                                itemsPerPage={itemsPerPage}
                                            />
                                        )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateSubmissionForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                        context="Workspace General"
                    />
                </div>
            )}
        </div>
    );
}
