"use client";

import React, { useState } from "react";
import { discussionsPageNavigationMenuItems } from "@/config/navItems.config";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { calculateDaysAgo } from "@/utils/functions";
import NavigationMenu from "@/components/headers/NavigationMenu";
import DiscussionsList from "@/components/community/discussions/DiscussionList";
import { CommentInfo, DiscussionInfo } from "@/types/infoTypes";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { useDiscussionsSearch } from "@/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";

export default function DiscussionsPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Discussions");

    // Custom hooks
    const discussionsData = useDiscussionsSearch({
        extraFilters: {},
        enabled: activeTab === "Discussions",
        context: "Browse Discussions",
    });

    return (
        <div className="mt-20">
            <BrowseHeaderUI
                breadcrumb={true}
                title={"Discussions"}
                searchBarPlaceholder="Search discussions..."
                context={"Browse Discussions"}
            />
            <NavigationMenu
                items={discussionsPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Discussions" && (
                    <div>
                        <DiscussionsList
                            discussions={discussionsData.data || []}
                            isLoading={discussionsData.isLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
