"use client";

import React, { useState } from "react";
import { userSettingsNavigationMenuItems } from "@/src/config/navItems.config";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
import { useUserSmallDataContext } from "@/src/contexts/current-user/UserSmallData";
import WorkspaceOverviewHeader from "@/src/components/headers/WorkspaceOverviewHeader";

export default function SettingsPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Global Settings");

    // Contexts
    const { userSmall } = useUserSmallDataContext();
    const currentUserId = userSmall.data?.[0]?.id;

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }

    return (
        <div>
            <WorkspaceOverviewHeader
                startingActiveTab="Settings"
                currentUser={userSmall.data?.[0]}
            />
            <NavigationMenu
                items={userSettingsNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-6"
            />
            <p>Settings!</p>
        </div>
    );
}
