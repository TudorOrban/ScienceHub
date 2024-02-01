"use client";

import React, { useEffect, useState } from "react";
import { issuesPageNavigationMenuItems } from "@/config/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import WorkspaceTable from "@/components/lists/WorkspaceTable";
import { useAllIssuesAdvanced } from "@/hooks/fetch/search-hooks/advanced/useAllIssuesAdvanced";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function IssuesPage() {
    // States
    const [projectIssues, setProjectIssues] = useState<GeneralInfo[]>([]);
    const [workIssues, setWorkIssues] = useState<GeneralInfo[]>([]);
    const [activeTab, setActiveTab] = useState<string>("Project Issues");

    // Contexts
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { projectIssuesData, workIssuesData, projectIssuesLoading, workIssuesLoading } =
        useAllIssuesAdvanced({
            activeTab: activeTab,
            page: selectedPage,
            itemsPerPage: itemsPerPage,
            context: "Browse Issues",
        });

    // Getting data ready for display
    useEffect(() => {
        if (projectIssuesData.status === "success" && projectIssuesData?.data) {
            setProjectIssues(
                projectIssuesData.data.map((projectIssue) => ({
                    id: projectIssue.id,
                    itemType: "issues",
                    icon: faFlask,
                    title: projectIssue.title,
                    createdAt: projectIssue.createdAt,
                    description: projectIssue.description,
                    users: projectIssue.users,
                    link: `/management/issues/${projectIssue.id}`,
                    public: projectIssue.public,
                }))
            );
        }
    }, [projectIssuesData.data]);

    useEffect(() => {
        if (workIssuesData.status === "success" && workIssuesData?.data) {
            setWorkIssues(
                workIssuesData.data.map((workIssue) => ({
                    id: workIssue.id,
                    itemType: "issues",
                    icon: faFlask,
                    title: workIssue.title,
                    createdAt: workIssue.createdAt,
                    description: workIssue.description,
                    users: workIssue.users,
                    link: `/management/issues/${workIssue.id}`,
                    public: workIssue.public,
                }))
            );
        }
    }, [workIssuesData.data]);

    return (
        <div className="">
            <BrowseHeaderUI
                title={"Browse Issues"}
                searchBarPlaceholder="Search issues..."
                context="Browse Issues"
            />
            <NavigationMenu
                items={issuesPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Project Issues" && (
                    <div>
                        <WorkspaceTable
                            data={projectIssues || []}
                            isLoading={projectIssuesData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {projectIssuesData.totalCount &&
                                projectIssuesData.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={projectIssuesData?.totalCount || 10}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Work Issues" && (
                    <div>
                        <WorkspaceTable data={workIssues} isLoading={workIssuesData.isLoading} />
                        <div className="flex justify-end my-4 mr-4">
                            {workIssuesData.totalCount &&
                                workIssuesData.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={workIssuesData?.totalCount || 10}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
