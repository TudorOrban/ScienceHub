"use client";

import React, { useState } from "react";
import useUserDetails from "../hooks/utils/useUserDetails";
import { useUserId } from "../contexts/general/UserIdContext";

export default function OverviewPage() {

    const [isDeleteModeOn, setIsDeleteModeOn] = useState<boolean>();

    const currentUserId = useUserId();
    const userDetailsData = useUserDetails(currentUserId || "", !!currentUserId);

    // const { data: projects, isLoading: projectsLoading, isError: projectsError } = useTransformedUserSmallProjectCardsSearch(userId);
    

    
    return (
        <div className="flex flex-row space-x-8 p-4">
            <div>
                <div>
                    Upcoming
                </div>
                <div>
                    Notifications
                </div>
                <div>
                    Bookmarks
                </div>
                <div>
                    Requests
                </div>
                <div>
                    Followed
                </div>
            </div>
            <div>
                Recent Activity
            </div>
        </div>
    );
}
