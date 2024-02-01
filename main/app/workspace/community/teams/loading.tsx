"use client";

import React from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { Skeleton } from "@/components/ui/skeleton";
import { teamsPageNavigationMenuItems } from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";

export default function Loading() {
    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Teams"}
                searchBarPlaceholder="Search teams..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
            />
            <NavigationMenu
                items={teamsPageNavigationMenuItems}
                activeTab={""}
                setActiveTab={() => ""}
                className="border-b border-gray-200 pt-4"
            />
            <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
        </div>
    );
}
