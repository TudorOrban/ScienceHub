"use client";

import React, { useEffect } from "react";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import ReusableBox from "@/components/elements/ReusableBox";
import useUserData from "@/hooks/utils/useUserData";
import { useCurrentUserDataContext } from "@/contexts/current-user/CurrentUserDataContext";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";

export default function WorkspaceOverviewPage() {
    const currentUserId = useUserId();
    // const userDetailsData = useUserDetails(currentUserId || "", !!currentUserId);


    // const { data: projects, isLoading: projectsLoading, isError: projectsError } = useTransformedUserSmallProjectCardsSearch(userId);

    const { currentUserData, setCurrentUserData } = useCurrentUserDataContext();
    const userData = useUserData(currentUserId || "", !!currentUserId);

    useEffect(() => {
        if (userData.status === "success") {
            setCurrentUserData(userData.data[0]);
        }
    }, [userData.data]);
    
    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }
    
    return (
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
    );
}
