import React from "react";
import { NavItem } from "@/src/types/infoTypes";
import BrowseSearchInput from "../complex-elements/search-inputs/BrowseSearchInput";

interface CommonUIProps {
    title?: string;
    searchBarPlaceholder?: string;
    navigationMenuItems?: NavItem[];
    context?: string;
    loading?: boolean;
    className?: string;
    advancedSearchMode?: boolean;
}

/**
 * Header for the Browse pages.
 */
const BrowseHeaderUI: React.FC<CommonUIProps> = ({
    title,
    searchBarPlaceholder,
    context = "Browse Projects",
    loading = false,
    className,
}) => {

    return (
        <div
            className={`w-full p-4 mb-2 ${className}`}
        >
            {title && (
                <h2 className="text-3xl text-gray-900 font-bold text-center text-primary my-6">
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
        </div>
    );
};

export default BrowseHeaderUI;
