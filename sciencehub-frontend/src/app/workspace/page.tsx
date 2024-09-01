"use client";

import React from "react";
import ReusableBox from "@/src/components/elements/ReusableBox";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
import WorkspaceOverviewHeader from "@/src/components/headers/WorkspaceOverviewHeader";
import { useUserSmallDataContext } from "@/src/contexts/current-user/UserSmallData";

/**
 * Workspace overview page. Work in progress.
 * 
 */
export default function WorkspaceOverviewPage() {
    // Contexts
    const { userSmall } = useUserSmallDataContext();
    const currentUserId = userSmall.data?.[0]?.id;

    const boxeLabels = [
        "New Submission Requests",
        "New Received Issues",
        "New Received Reviews",
        "New Discussion Comments",
        "New Messages",
        "New Team Invites",
        "Upcoming Plans",
        "Bookmarks",
    ];

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <>
            <WorkspaceOverviewHeader
                startingActiveTab="Overview"
                currentUser={userSmall.data?.[0]}
            />
            <div className="flex flex-col space-y-8 p-8">
                {boxeLabels.map((label) => (
                    <ReusableBox key={label} label={label}>
                        <div className="flex items-center justify-center h-20 py-8 font-semibold">
                            No items found.
                        </div>
                    </ReusableBox>
                ))}
            </div>
        </>
    );
}
