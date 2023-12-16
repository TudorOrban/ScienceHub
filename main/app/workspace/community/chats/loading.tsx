"use client";

import React from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";

export default function Loading() {
    
    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Chats"}
                searchBarPlaceholder="Search chats..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={() => {}}
            />
            <div className="w-full">
                <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
            </div>
        </div>
    );
}
