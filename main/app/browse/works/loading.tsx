"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";

export default function Loading() {
    return (
        <div className="mt-20">
            <BrowseHeaderUI
                breadcrumb={true}
                title={"Browse Works"}
                searchBarPlaceholder="Search works..."
                context={"Browse Works"}
                loading={true}
            />
            <div className="w-full">
                <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
            </div>
        </div>
    );
}
