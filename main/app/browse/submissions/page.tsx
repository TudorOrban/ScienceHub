"use client";

import React, { useState } from "react";
import { submissionsPageNavigationMenuItems } from "@/utils/navItems.config";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { GeneralInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import GeneralList from "@/components/lists/GeneralList";
import { useAllSubmissionsAdvanced } from "@/hooks/fetch/search-hooks/advanced/useAllSubmissionsAdvanced";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function SubmissionsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");


    // Contexts
    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;


    // Custom Hooks
    const {
        projectSubmissionsData,
        workSubmissionsData,
        projectSubmissionsLoading,
        workSubmissionsLoading,
    } = useAllSubmissionsAdvanced({
        activeTab: activeTab,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
        context: "Browse Submissions"
    });

    
    // Getting data ready for display
    let projectSubmissions,
        workSubmissions: GeneralInfo[] = [];

    if (projectSubmissionsData?.data) {
        projectSubmissions = projectSubmissionsData.data.map(
            (projectSubmission) => ({
                id: projectSubmission.id,
                itemType: "project_submissions",
                icon: faFlask,
                title: projectSubmission.title,
                createdAt: projectSubmission.createdAt,
                description: projectSubmission.description,
                users: projectSubmission.users,
                link: `/management/submissions/${projectSubmission.id}`,
                public: projectSubmission.public,
            })
        );
    }

    if (workSubmissionsData?.data) {
        workSubmissions = workSubmissionsData.data.map(
            (workSubmission: any) => ({
                id: workSubmission.id,
                itemType: "work_submissions",
                icon: faFlask,
                title: workSubmission.title,
                createdAt: workSubmission.createdAt,
                description: workSubmission.description,
                users: workSubmission.users,
                link: `/management/submissions/${workSubmission.id}$`,
                public: workSubmission.public,
            })
        );
    }

    return (
        <div className="">
            <BrowseHeaderUI
                title={"Browse Submissions"}
                searchBarPlaceholder="Search submissions..."
                context="Browse Submissions"
            />
            <NavigationMenu
                items={submissionsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Project Submissions" && (
                    <div>
                        <div>
                            <GeneralList
                                data={projectSubmissions || []}
                                isLoading={projectSubmissionsData.isLoading}
                            />
                        </div>
                        <div className="flex justify-end my-4 mr-4">
                            {projectSubmissionsData.totalCount &&
                                projectSubmissionsData.totalCount >=
                                    itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            projectSubmissionsData?.totalCount ||
                                            10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Work Submissions" && (
                    <div>
                        <div>
                            <GeneralList
                                data={workSubmissions}
                                isLoading={workSubmissionsData.isLoading}
                            />
                        </div>
                        <div className="flex justify-end my-4 mr-4">
                            {workSubmissionsData.totalCount &&
                                workSubmissionsData.totalCount >=
                                    itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            workSubmissionsData?.totalCount || 10
                                        }
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
