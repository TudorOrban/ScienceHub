"use client";

import React from "react";
import ReusableBox from "@/components/elements/ReusableBox";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import WorkspaceOverviewHeader from "@/components/headers/WorkspaceOverviewHeader";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";

/**
 * Workspace overview page. Work in progress.
 * 
 */
export default function WorkspaceOverviewPage() {
    // Contexts
    const { userSmall } = useUserSmallDataContext();
    const currentUserId = userSmall.data?.[0]?.id;

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <>
            <WorkspaceOverviewHeader
                startingActiveTab="Overview"
                currentUser={userSmall.data?.[0]}
            />
            <div className="flex flex-col space-y-8 p-4">
                <ReusableBox label={"New Submission Requests"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Submission Requests.
                    </div>
                </ReusableBox>
                <ReusableBox label={"New Received Issues"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Received Issues.
                    </div>
                </ReusableBox>
                <ReusableBox label={"New Received Reviews"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Received Reviews.
                    </div>
                </ReusableBox>
                <ReusableBox label={"New Discussion Comments"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Discussion Comments.
                    </div>
                </ReusableBox>
                <ReusableBox label={"New Messages"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Messages.
                    </div>
                </ReusableBox>
                <ReusableBox label={"New Team Invites"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Team Invites.
                    </div>
                </ReusableBox>
                <ReusableBox label={"Upcoming Plans"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No Upcoming Plans.
                    </div>
                </ReusableBox>
                <ReusableBox label={"Bookmarks"}>
                    <div className="flex items-center justify-center h-20 py-8 text-lg font-semibold">
                        No New Bookmarks.
                    </div>
                </ReusableBox>
                {/* <div>
                <div>Upcoming</div>
                <div>Notifications</div>
                <div>Bookmarks</div>
                <div>Requests</div>
                <div>Followed</div>
            </div>
            <div>Recent Activity</div> */}
            </div>
        </>
    );
}
