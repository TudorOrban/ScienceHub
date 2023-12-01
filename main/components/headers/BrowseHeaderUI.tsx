import React, { useState } from "react";
import { NavItem } from "@/types/infoTypes";
import { useBrowseSearchContext } from "@/app/hooks/fetch/search-hooks/useBrowseSearchContext";
import dynamic from "next/dynamic";
const Breadcrumb = dynamic(() => import("@/components/elements/Breadcrumb"));
const NavigationMenu = dynamic(() => import("@/components/headers/NavigationMenu"));
const BrowseSearchInput = dynamic(() => import("@/components/complex-elements/BrowseSearchInput"));

interface CommonUIProps {
    breadcrumb?: boolean;
    title?: string;
    searchBarPlaceholder?: string;
    navigationMenuItems?: NavItem[];
    context?: string;
    loading?: boolean;
    className?: string;
    advancedSearchMode?: boolean;
}

const BrowseHeaderUI: React.FC<CommonUIProps> = ({
    breadcrumb,
    title,
    searchBarPlaceholder,
    navigationMenuItems,
    context = "Browse Projects",
    loading = false,
    className,
}) => {
    const [activeTab, setActiveTab] = useState<string>("");
    
    return (
        <div
            className={`w-full p-4 mb-2 ${className}`}
        >
            {/* Breadcrumb and Title */}
            {breadcrumb && (
                <div className="m-2 text-secondary">
                    <Breadcrumb />
                </div>
            )}
            {title && (
                <h2 className="text-3xl text-gray-900 font-bold text-center text-primary mb-6 mt-4 ml-2">
                    {title}
                </h2>
            )}
            {searchBarPlaceholder && !loading && (
                <div className="flex justify-center">
                    <BrowseSearchInput
                        placeholder={searchBarPlaceholder}
                        context={context}
                        searchMode={"onClick"}
                    />
                </div>
            )}
           
            {navigationMenuItems && (
                <NavigationMenu
                    items={navigationMenuItems}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}
        </div>
    );
};

export default BrowseHeaderUI;
