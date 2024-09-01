"use client";

import React from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import BrowseHeaderUI from "@/src/components/headers/BrowseHeaderUI";

export default function Loading() {
    return (
        <div>
            <BrowseHeaderUI
                title={"Browse Works"}
                searchBarPlaceholder="Search works..."
                loading={true}
            />
            <div className="w-full">
                <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
            </div>
        </div>
    );
}
