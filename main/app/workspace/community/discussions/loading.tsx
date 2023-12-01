"use client";

import React from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { Skeleton } from "@/components/ui/skeleton";
import { discussionsPageNavigationMenuItems } from "@/utils/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { defaultAvailableSearchOptions } from "@/utils/availableSearchOptionsSimple";

export default function Loading() {
    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
            />
            <NavigationMenu
                items={discussionsPageNavigationMenuItems}
                activeTab={""}
                setActiveTab={() => ""}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
            </div>
        </div>
    );
}
