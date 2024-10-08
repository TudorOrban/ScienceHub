"use client";

import React, { use, useEffect, useState } from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import {
    managementFilterNavigationMenuItems,
    submissionsPageNavigationMenuItems,
} from "@/src/config/navItems.config";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import { GeneralInfo } from "@/src/types/infoTypes";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { useAllSubmissionsSearch } from "@/src/hooks/fetch/search-hooks/submissions/useAllSubmissions";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { transformToSubmissionsInfo } from "@/src/utils/transforms-to-ui-types/transformToSubmissionsInfo";
import deepEqual from "fast-deep-equal";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
const CreateSubmissionForm = dynamic(() => import("@/src/components/forms/CreateSubmissionForm"));
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function SubmissionsPage() {
    // States
    const [projectSubmissions, setProjectSubmissions] = useState<GeneralInfo[]>([]);
    const [workSubmissions, setWorkSubmissions] = useState<GeneralInfo[]>([]);
    const [projectSubmissionRequests, setProjectSubmissionRequests] = useState<GeneralInfo[]>([]);
    const [workSubmissionRequests, setWorkSubmissionRequests] = useState<GeneralInfo[]>([]);
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");
    const [activeSelection, setActiveSelection] = useState<string>("Yours");
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;
    const currentUserId = useUserId();

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
        userId: currentUserId,
        activeTab: activeTab,
        activeSelection: activeSelection,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (mergedProjectSubmissions.status === "success" && mergedProjectSubmissions?.data) {
            const submissions = transformToSubmissionsInfo(
                mergedProjectSubmissions.data || [],
                submissionsProjects,
                submissionRequestsProjects,
                submissionsWorks,
                submissionRequestsWorks,
                false,
                "project_submissions"
            );
            if (!deepEqual(submissions, projectSubmissions)) {
                setProjectSubmissions(submissions);
            }
        }
    }, [mergedProjectSubmissions.data]);

    useEffect(() => {
        if (mergedWorkSubmissions.status === "success") {
            const submissions = transformToSubmissionsInfo(
                mergedWorkSubmissions.data || [],
                submissionsProjects,
                submissionRequestsProjects,
                submissionsWorks,
                submissionRequestsWorks,
                false,
                "work_submissions"
            );
            if (!deepEqual(submissions, workSubmissions)) {
                setWorkSubmissions(submissions);
            }
        }
    }, [mergedWorkSubmissions.data]);

    useEffect(() => {
        if (mergedProjectSubmissionRequests.status === "success") {
            const submissions = transformToSubmissionsInfo(
                mergedProjectSubmissionRequests.data || [],
                submissionsProjects,
                submissionRequestsProjects,
                submissionsWorks,
                submissionRequestsWorks,
                true,
                "project_submissions"
            );
            if (!deepEqual(submissions, projectSubmissionRequests)) {
                setProjectSubmissionRequests(submissions);
            }
        }
    }, [mergedProjectSubmissionRequests.data]);

    useEffect(() => {
        if (
            mergedWorkSubmissionRequests.status === "success" &&
            mergedWorkSubmissionRequests?.data
        ) {
            const submissions = transformToSubmissionsInfo(
                mergedWorkSubmissionRequests.data || [],
                submissionsProjects,
                submissionRequestsProjects,
                submissionsWorks,
                submissionRequestsWorks,
                true,
                "work_submissions"
            );

            if (!deepEqual(submissions, workSubmissionRequests)) {
                setWorkSubmissionRequests(submissions);
            }
        }
    }, [mergedWorkSubmissionRequests.data]);

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

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Submissions"}
                searchBarPlaceholder="Search submissions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                refetch={getRefetchFunction()}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onDelete={toggleDeleteMode}
            />
            <div className="flex items-center justify-between flex-wrap md:flex-nowrap space-x-4 pt-4 w-full">
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
                    className="border-b border-gray-300 pt-6 md:pt-0 flex-shrink-0 ml-2 justify-end min-w-max"
                />
            </div>
            <div className="w-full">
                {activeTab === "Project Submissions" && (
                    <>
                        {activeSelection === "Yours" && (
                            <div>
                                <WorkspaceTable
                                    data={projectSubmissions || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType={"project_submissions"}
                                    isLoading={mergedProjectSubmissions.isLoading}
                                    isSuccess={mergedProjectSubmissions.status === "success"}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedProjectSubmissions.totalCount &&
                                        mergedProjectSubmissions.totalCount >= itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedProjectSubmissions?.totalCount || 10
                                                }
                                                itemsPerPage={itemsPerPage}
                                            />
                                        )}
                                </div>
                            </div>
                        )}
                        {activeSelection === "Received" && (
                            <div>
                                <WorkspaceTable
                                    data={projectSubmissionRequests || []}
                                    columns={["Title", "Users", "Project"]}
                                    itemType={"project_submissions"}
                                    isLoading={mergedProjectSubmissionRequests.isLoading}
                                    isSuccess={mergedProjectSubmissionRequests.status === "success"}
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
                                <WorkspaceTable
                                    data={workSubmissions || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType={"work_submissions"}
                                    isLoading={mergedWorkSubmissions.isLoading}
                                    isSuccess={mergedWorkSubmissions.status === "success"}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedWorkSubmissions.totalCount &&
                                        mergedWorkSubmissions.totalCount >= itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedWorkSubmissions?.totalCount || 10
                                                }
                                                itemsPerPage={itemsPerPage}
                                            />
                                        )}
                                </div>
                            </div>
                        )}
                        {activeSelection === "Received" && (
                            <div>
                                <WorkspaceTable
                                    data={workSubmissionRequests || []}
                                    columns={["Title", "Users", "Work"]}
                                    itemType={"work_submissions"}
                                    isLoading={mergedWorkSubmissionRequests.isLoading}
                                    isSuccess={mergedWorkSubmissionRequests.status === "success"}
                                />
                                <div className="flex justify-end my-4 mr-4">
                                    {mergedWorkSubmissionRequests.totalCount &&
                                        mergedWorkSubmissionRequests.totalCount >= itemsPerPage && (
                                            <PageSelect
                                                numberOfElements={
                                                    mergedWorkSubmissionRequests?.totalCount || 10
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
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                        context="Workspace General"
                    />
                </div>
            )}
        </div>
    );
}
