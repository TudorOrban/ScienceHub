"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { useProjectsSearch } from "@/src/hooks/fetch/search-hooks/projects/useProjectsSearch";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import { projectsAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { MediumProjectCard } from "@/src/types/projectTypes";
import MediumProjectCardUI from "@/src/components/cards/projects/MediumProjectCardUI";
import { useIdentifierContext } from "@/src/contexts/current-user/IdentifierContext";
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function ProjectsPage({
    params: { identifier },
}: {
    params: { identifier: string };
}) {
    // States
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">("collapsed");
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    // Contexts
    const { identifier: contextIdentifier, users, teams, isUser } = useIdentifierContext();
    const currentUserId = users?.[0]?.id;
    const enabled = !!currentUserId && isUser;

    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 10;

    // Custom projects hook
    const projectsData = useProjectsSearch({
        extraFilters: { users: currentUserId },
        enabled: enabled,
        context: "Workspace General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    const loadingProjects: MediumProjectCard[] = [
        { id: -1, title: "" },
        { id: -2, title: "" },
        { id: -3, title: "" },
        { id: -4, title: "" },
    ];

    return (
        <div className="overflow-x-hidden ">
            <ListHeaderUI
                breadcrumb={true}
                title={"Projects"}
                searchBarPlaceholder="Search projects..."
                sortOptions={projectsAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
            />
            <>
                <div className="pr-4 px-6 py-4 border-b border-gray-300 ">
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
                {!projectsData.isLoading ? (
                    <>
                        {(projectsData.data || []).map((project, index) => (
                            <div
                                key={project.id}
                                className={`mx-6 ${viewMode === "expanded" ? "my-6" : "my-4"}`}
                            >
                                <MediumProjectCardUI
                                    project={project}
                                    viewMode={viewMode}
                                    isLoading={projectsData.isLoading}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {(loadingProjects || []).map((project, index) => (
                            <div
                                key={project.id}
                                className={`mx-6 ${viewMode === "expanded" ? "my-6" : "my-4"}`}
                            >
                                <MediumProjectCardUI
                                    project={project}
                                    viewMode={viewMode}
                                    disableViewMode={false}
                                    isLoading={projectsData.isLoading}
                                />
                            </div>
                        ))}
                    </>
                )}
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
