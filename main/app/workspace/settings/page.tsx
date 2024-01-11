"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { userSettingsNavigationMenuItems } from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";

export default function SettingsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Global Settings");

    const currentUserId = useUserId();

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }

    return (
        <div>
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
