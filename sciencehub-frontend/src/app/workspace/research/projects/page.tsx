"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import { useProjectsSearch } from "@/src/hooks/fetch/search-hooks/projects/useProjectsSearchNew";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import dynamic from "next/dynamic";
import { projectsAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import MediumProjectCardUI from "@/src/components/cards/projects/MediumProjectCardUI";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
import { ProjectSearchDTO } from "@/src/types/projectTypes";
const CreateProjectForm = dynamic(() => import("@/src/components/forms/CreateProjectForm"));
const PageSelect = dynamic(() => import("@/src/components/complex-elements/PageSelect"));

export default function ProjectsPage() {
    // States
    const [viewMode, setViewMode] = useState<"expanded" | "collapsed">("collapsed");
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");
    const [sortDescending, setSortDescending] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 10;

    // Custom project hook
    const projectsData = useProjectsSearch({
        entityId: currentUserId ?? "",
        enabled: !!currentUserId,
        searchQuery: searchQuery,
        sortBy: sortOption,
        sortDescending: sortDescending,
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    // Search handlers
    const handleSearchChange = (newSearchQuery: string) => {
        setSearchQuery(newSearchQuery);
        console.log("Query: ", newSearchQuery);
    };

    const handleSortChange = (newSortOption: string) => {
        setSortOption(newSortOption);
        console.log("Sort: ", newSortOption);
    };

    const handleSortDescendingChange = (newSortDescending: boolean) => {
        setSortDescending(newSortDescending);
        console.log("Sort Descending: ", newSortDescending);
    }

    const loadingProjects: ProjectSearchDTO[] = [
        { id: -1, title: "", name: "" },
        { id: -2, title: "", name: "" },
        { id: -3, title: "", name: "" },
        { id: -4, title: "", name: "" },
    ];

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    if (projectsData.isLoading) {
        return (
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
        );
    }

    return (
        <div className="overflow-x-hidden ">
            <ListHeaderUI
                breadcrumb={true}
                title={"Projects"}
                searchBarPlaceholder="Search projects..."
                sortOptions={projectsAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => setCreateNewOn(!createNewOn)}
                onSearchChange={handleSearchChange}
                onSortOptionChange={handleSortChange}
                onSortDirectionChange={handleSortDescendingChange}
                // refetch={projectsData.refetch}
            />
            {createNewOn && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <CreateProjectForm
                        createNewOn={createNewOn}
                        onCreateNew={() => setCreateNewOn(!createNewOn)}
                    />
                </div>
            )}
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
            {(projectsData?.data?.results || []).map((project, index) => (
                <div
                    key={project.id}
                    className={`mx-8 ${viewMode === "expanded" ? "my-6" : "my-4"}`}
                >
                    <MediumProjectCardUI
                        project={project}
                        viewMode={viewMode}
                        isLoading={projectsData.isLoading}
                    />
                </div>
            ))}
            <div className="flex justify-end my-4 mr-4">
                {projectsData.data.results && (projectsData.data.totalCount ?? 0) >= itemsPerPage && (
                    <PageSelect
                        numberOfElements={projectsData?.data.totalCount || 10}
                        itemsPerPage={itemsPerPage}
                    />
                )}
            </div>
        </div>
    );
}
