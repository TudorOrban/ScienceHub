"use client";

import React from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { reviewsPageNavigationMenuItems } from "@/src/config/navItems.config";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import BrowseHeaderUI from "@/src/components/headers/BrowseHeaderUI";

export default function Loading() {
    return (
        <div>
            <BrowseHeaderUI
                title={"Submissions"}
                searchBarPlaceholder="Search submissions..."
                context={"Browse Submissions"}
            />
            <NavigationMenu
                items={reviewsPageNavigationMenuItems}
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
