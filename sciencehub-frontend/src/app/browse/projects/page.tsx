"use client";

import React, { useState } from "react";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import ProjectSearchResults from "@/src/components/lists/ProjectsSearchResults";
import { useDeleteGeneralObject } from "@/src/hooks/delete/useDeleteGeneralObject";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import BrowseHeaderUI from "@/src/components/headers/BrowseHeaderUI";
import dynamic from "next/dynamic";
import { useAdvancedProjectsSearch } from "@/src/hooks/fetch/search-hooks/advanced/useAdvancedProjectsSearch";
const CreateProjectForm = dynamic(() => import("@/src/components/forms/CreateProjectForm"));
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function BrowseProjectsPage() {
    // States
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">("collapsed");
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom project hook
    const projectsData = useAdvancedProjectsSearch({
        extraFilters: {},
        enabled: currentUserId !== null && currentUserId !== undefined && currentUserId !== "",
        context: "Browse Projects",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });
    const projects = projectsData.data || [];

    // Delete
    const deleteGeneral = useDeleteGeneralObject("projects");

    return (
        <div>
            <BrowseHeaderUI
                title={"Browse Projects"}
                searchBarPlaceholder="Search..."
                context="Browse Projects"
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateProjectForm
                        createNewOn={createNewOn}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
            <>
                <div className="border-b border-gray-300 md:px-6 py-4">
                    <span
                        className={`cursor-pointer px-4 py-1 mb-3 ${
                            viewMode === "collapsed" ? "text-gray-900" : "text-gray-400"
                        }`}
                        onClick={() => setViewMode("collapsed")}
                    >
                        Collapsed View
                    </span>
                    <span
                        className={`cursor-pointer px-4 mb-2 ${
                            viewMode === "expanded" ? "text-gray-900" : "text-gray-400"
                        }`}
                        onClick={() => setViewMode("expanded")}
                    >
                        Expanded View
                    </span>
                </div>
                <ProjectSearchResults
                    data={projects}
                    isLoading={projectsData.isLoading || false}
                    isError={projectsData.serviceError}
                    viewMode={viewMode}
                />
                <div className="flex justify-end my-4 mr-4">
                    {projectsData.totalCount && projectsData.totalCount >= itemsPerPage && (
                        <PageSelect
                            numberOfElements={projectsData?.totalCount || 10}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>
            </>
        </div>
    );
}
