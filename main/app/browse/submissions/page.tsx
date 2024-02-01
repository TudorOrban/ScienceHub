"use client";

import React, { useState } from "react";
import { submissionsPageNavigationMenuItems } from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import dynamic from "next/dynamic";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useAllSubmissionsAdvanced } from "@/hooks/fetch/search-hooks/advanced/useAllSubmissionsAdvanced";
import BrowseSubmissionsList from "@/components/lists/browse/BrowseSubmissionsList";
const PageSelect = dynamic(() => import("@/components/complex-elements/PageSelect"));

export default function SubmissionsPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Project Submissions");

    // Contexts
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const { projectSubmissionsData, workSubmissionsData } = useAllSubmissionsAdvanced({
        activeTab: activeTab,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
        context: "Browse Submissions",
    });

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
                        <BrowseSubmissionsList
                            submissions={projectSubmissionsData.data || []}
                            isLoading={projectSubmissionsData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {projectSubmissionsData.totalCount &&
                                projectSubmissionsData.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={projectSubmissionsData?.totalCount || 10}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Work Submissions" && (
                    <div>
                        <BrowseSubmissionsList
                            submissions={workSubmissionsData.data}
                            isLoading={workSubmissionsData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {workSubmissionsData.totalCount &&
                                workSubmissionsData.totalCount >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={workSubmissionsData?.totalCount || 10}
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
