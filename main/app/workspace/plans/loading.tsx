"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import WorkspaceOverviewHeader from "@/components/headers/WorkspaceOverviewHeader";

export default function Loading() {
    return (
        <div>
            <WorkspaceOverviewHeader
                startingActiveTab="Plans"
                currentUser={{ id: "", username: "", fullName: "" }}
            />
            <Skeleton className="w-full h-[400px] bg-white rounded-lg shadow-md mb-4 transition-shadow duration-200 animate-pulse" />
        </div>
    );
}
