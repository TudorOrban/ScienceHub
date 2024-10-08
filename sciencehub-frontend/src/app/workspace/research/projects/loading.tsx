"use client";

import React from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import ProjectSearchResults from "@/src/components/lists/ProjectsSearchResults";
import { projectsAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
    const [viewMode, setViewMode] = React.useState<"expanded" | "collapsed">("collapsed");

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Projects"}
                searchBarPlaceholder="Search projects..."
                sortOptions={projectsAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
                onDelete={() => {}}
            />

            <div className="border-b border-gray-500 mr-4 p-2">
                <span
                    className={`cursor-pointer px-4 py-1 mb-3 ${
                        viewMode === "collapsed" ? "text-gray-900" : "text-gray-400"
                    }`}
                    onClick={() => setViewMode("collapsed")}
                >
                    Collapsed View
                </span>
                <span
                    className={`cursor-pointer px-2 mb-2 ${
                        viewMode === "expanded" ? "text-gray-900" : "text-gray-400"
                    }`}
                    onClick={() => setViewMode("expanded")}
                >
                    Expanded View
                </span>
            </div>
            <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
        </div>
    );
}
