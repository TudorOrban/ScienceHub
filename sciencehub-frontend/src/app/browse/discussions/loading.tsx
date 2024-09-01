"use client";

import React from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { discussionsPageNavigationMenuItems } from "@/src/config/navItems.config";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import BrowseHeaderUI from "@/src/components/headers/BrowseHeaderUI";

export default function Loading() {
    return (
        <div>
            <BrowseHeaderUI
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                context={"Browse Discussions"}
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
