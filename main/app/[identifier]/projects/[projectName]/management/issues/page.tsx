"use client";

import React, { useEffect, useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { Issue } from "@/types/managementTypes";
import { useProjectIssuesSearch } from "@/hooks/fetch/search-hooks/management/useProjectIssuesSearch";
import { GeneralInfo } from "@/types/infoTypes";
import { useProjectSmallContext } from "@/contexts/project/ProjectSmallContext";
import { useWorkIssuesSearch } from "@/hooks/fetch/search-hooks/management/useWorkIssuesSearch";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { issuesPageNavigationMenuItems } from "@/config/navItems.config";
const CreateIssueForm = dynamic(() => import("@/components/forms/CreateIssueForm"));
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function IssuesPage({
    params: { identifier, projectName },
}: {
    params: { identifier: string; projectName: string };
}) {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Project Issues");

    // - Data
    const [projectIssues, setProjectIssues] = useState<GeneralInfo[]>([]);
    const [workIssues, setWorkIssues] = useState<GeneralInfo[]>([]);

    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    // Contexts
    // - Project small
    const { projectSmall } = useProjectSmallContext();

    // - Current user
    const currentUserId = useUserId();
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: projectName,
    });
    const isProjectIdAvailable = !!projectId;

    const projectIssuesData = useProjectIssuesSearch({
        tableFilters: {
            project_id: projectId?.toString() || "0",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const workIssuesData = useWorkIssuesSearch({
        tableFilters: {
            project_id: projectId?.toString() || "0",
        },
        enabled: isProjectIdAvailable,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Getting data ready for display
    useEffect(() => {
        if (projectIssuesData.status === "success" && projectIssuesData?.data) {
            setProjectIssues(
                projectIssuesData.data.map((issue) => ({
                    id: issue.id,
                    icon: faFlask,
                    itemType: "project_issues",
                    title: issue.title,
                    createdAt: issue.createdAt,
                    description: issue.description,
                    link: `/${identifier}/projects/${projectName}/management/project-issues/${issue.id}`,
                    users: issue.users,
                    teams: issue.teams,
                    public: issue.public,
                }))
            );
        }
    }, [projectIssuesData.data]);

    useEffect(() => {
        if (workIssuesData.status === "success" && workIssuesData?.data) {
            setWorkIssues(
                workIssuesData.data.map((issue) => ({
                    id: issue.id,
                    icon: faFlask,
                    itemType: "work_issues",
                    title: issue.title,
                    createdAt: issue.createdAt,
                    description: issue.description,
                    link: `/${identifier}/projects/${projectName}/management/work-issues/${issue.id}`,
                    users: issue.users,
                    teams: issue.teams,
                    public: issue.public,
                }))
            );
        }
    }, [workIssuesData.data]);

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Project Issues"}
                searchBarPlaceholder="Search issues..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
            />
            <NavigationMenu
                items={issuesPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateIssueForm
                        initialValues={{
                            initialIssueObjectType: "Project",
                            initialProjectId: projectId?.toString(),
                        }}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            {activeTab === "Project Issues" && (
                <div>
                    <GeneralList
                        data={projectIssues || []}
                        isLoading={projectIssuesData.isLoading}
                        isSuccess={projectIssuesData.status === "success"}
                        itemType="project_issues"
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {projectIssuesData.data.length &&
                            projectIssuesData.data.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={projectIssuesData.data.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            )}
            {activeTab === "Work Issues" && (
                <div>
                    <GeneralList
                        data={workIssues || []}
                        isLoading={workIssuesData.isLoading}
                        isSuccess={workIssuesData.status === "success"}
                        itemType="work_issues"
                    />
                    <div className="flex justify-end my-4 mr-4">
                        {workIssuesData.data.length &&
                            workIssuesData.data.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={workIssuesData.data.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
