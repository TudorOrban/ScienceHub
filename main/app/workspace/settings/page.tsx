"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { userSettingsNavigationMenuItems } from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";

export default function SettingsPage() {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Experiments");

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Settings"}
                searchBarPlaceholder="Search settings..."
            />
            <NavigationMenu
                items={userSettingsNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <p>Settings!</p>
        </div>
    );
}
