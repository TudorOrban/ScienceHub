"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { useDeleteGeneralObject } from "@/hooks/delete/useDeleteGeneralObject";
import { useProjectsSearch } from "@/hooks/fetch/search-hooks/projects/useProjectsSearch";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import { projectsAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
import { MediumProjectCard } from "@/types/projectTypes";
import MediumProjectCardUI from "@/components/cards/projects/MediumProjectCardUI";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
const CreateProjectForm = dynamic(
    () => import("@/components/forms/CreateProjectForm")
);
const PageSelect = dynamic(
    () => import("@/components/complex-elements/PageSelect")
);

export default function ProjectsPage() {
    // States
    // - Card view mode
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">(
        "collapsed"
    );

    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    // Contexts
    // - Current user
    const currentUserId = useUserId();
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 10;

    
    // Custom project hook
    const projectsData = useProjectsSearch({
        extraFilters: { users: currentUserId },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });


    // Delete
    const deleteGeneral = useDeleteGeneralObject("projects");

    const loadingProjects: MediumProjectCard[] = [
        { id: -1, title: "" },
        { id: -2, title: "" },
        { id: -3, title: "" },
        { id: -4, title: "" },
    ];

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }
    
    return (
        <div className="overflow-x-hidden ">
            <ListHeaderUI
                breadcrumb={true}
                title={"Projects"}
                searchBarPlaceholder="Search projects..."
                sortOptions={
                    projectsAvailableSearchOptions.availableSortOptions
                }
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateProjectForm
                        createNewOn={createNewOn}
                        onCreateNew={onCreateNew}
                    />
                </div>
            )}
            <>
                <div className="pr-4 px-6 py-4 border-b border-gray-300 ">
                    <span
                        className={`cursor-pointer px-4 py-1 mb-3 ${
                            viewMode === "collapsed"
                                ? "text-gray-900"
                                : "text-gray-400"
                        }`}
                        onClick={() => setViewMode("collapsed")}
                    >
                        Collapsed View
                    </span>
                    <span
                        className={`cursor-pointer px-4 mb-2 ${
                            viewMode === "expanded"
                                ? "text-gray-900"
                                : "text-gray-400"
                        }`}
                        onClick={() => setViewMode("expanded")}
                    >
                        Expanded View
                    </span>
                </div>
                {/* <ProjectSearchResults
                    data={projects}
                    isLoading={projectsData.isLoading || false}
                    isError={projectsData.serviceError}
                    viewMode={viewMode}
                    onDeleteProject={deleteGeneral.handleDeleteObject}
                /> */}
                {!projectsData.isLoading ? (
                    <>
                        {(projectsData.data || []).map((project, index) => (
                            <div
                                key={project.id}
                                className={`mx-6 ${
                                    viewMode === "expanded" ? "my-6" : "my-4"
                                }`}
                            >
                                <MediumProjectCardUI
                                    project={project}
                                    viewMode={viewMode}
                                    isLoading={projectsData.isLoading}
                                    onDeleteProject={
                                        deleteGeneral.handleDeleteObject
                                    }
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {(loadingProjects || []).map((project, index) => (
                            <div
                                key={project.id}
                                className={`mx-6 ${
                                    viewMode === "expanded" ? "my-6" : "my-4"
                                }`}
                            >
                                <MediumProjectCardUI
                                    project={project}
                                    viewMode={viewMode}
                                    onDeleteProject={
                                        deleteGeneral.handleDeleteObject
                                    }
                                    disableViewMode={false}
                                    isLoading={projectsData.isLoading}
                                    isError={projectsData.serviceError}
                                />
                            </div>
                        ))}
                    </>
                )}
                <div className="flex justify-end my-4 mr-4">
                    {projectsData.totalCount &&
                        projectsData.totalCount >= itemsPerPage && (
                            <PageSelect
                                numberOfElements={
                                    projectsData?.totalCount || 10
                                }
                                itemsPerPage={itemsPerPage}
                            />
                        )}
                </div>
            </>
        </div>
    );
}
