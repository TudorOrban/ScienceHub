"use client";

import React, { useState } from "react";
import { discussionsPageNavigationMenuItems } from "@/config/navItems.config";
import NavigationMenu from "@/components/headers/NavigationMenu";
import DiscussionsList from "@/components/community/discussions/DiscussionList";
import BrowseHeaderUI from "@/components/headers/BrowseHeaderUI";
import { useDiscussionsSearch } from "@/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import PageSelect from "@/components/complex-elements/PageSelect";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";

// Browse Discussions page.
// TODO: Replace pagination with infinite query.
export default function BrowseDiscussionsPage() {
    // States
    const [activeTab, setActiveTab] = useState<string>("Discussions");

    // Contexts
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom hooks
    const discussionsData = useDiscussionsSearch({
        extraFilters: {},
        enabled: activeTab === "Discussions",
        context: "Browse Discussions",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
    });

    return (
        <div>
            <BrowseHeaderUI
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
                        <div className="flex justify-end my-4 mr-4">
                            {discussionsData.data.length &&
                                discussionsData.data.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={discussionsData.data.length}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
