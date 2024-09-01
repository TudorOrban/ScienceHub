"use client";

import React from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import BrowseHeaderUI from "@/src/components/headers/BrowseHeaderUI";

export default function Loading() {
    return (
        <div>
            <BrowseHeaderUI title={"Browse Projects"} searchBarPlaceholder="Search projects..." />
            <div className="border-b border-gray-300 md:px-6 py-4">
                <span className={`cursor-pointer px-4 py-1 mb-3 text-gray-900`} onClick={() => {}}>
                    Collapsed View
                </span>
                <span className={`cursor-pointer px-4 mb-2 text-gray-400`} onClick={() => {}}>
                    Expanded View
                </span>
            </div>
            <div className="w-full">
                <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
            </div>
        </div>
    );
}
