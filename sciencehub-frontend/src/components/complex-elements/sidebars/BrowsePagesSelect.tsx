import { faCaretDown, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarState } from "@/src/contexts/sidebar-contexts/SidebarContext";
import { browseNavItems } from "@/src/config/navItems.config";
import { upperCaseFirstLetter } from "@/src/utils/functions";
import { browsePages } from "@/src/config/availableSearchOptionsAdvanced";
import { Feature } from "@/src/types/infoTypes";

interface BrowsePagesSelectProps {
    selectedBrowsePage: Feature;
    setSelectedBrowsePage: (page: Feature) => void;
}

/**
 * Dropdown for selecting a browse page.
 */
const BrowsePagesSelect: React.FC<BrowsePagesSelectProps> = ({
    selectedBrowsePage,
    setSelectedBrowsePage,
}) => {
    // States
    const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] = useState<boolean>(false);

    // Contexts
    const router = useRouter();
    const pathname = usePathname();
    const { isSidebarOpen, isInBrowseMode, setIsInBrowseMode, setNavItems } = useSidebarState();

    // Manage browse mode and items based on pathname
    useEffect(() => {
        const splittedPath = pathname.split("/");
        if (splittedPath[1] === "browse") {
            setIsInBrowseMode(true);
            setNavItems(browseNavItems);
            if (!splittedPath[2]) return;

            // Sync selected page
            const selectedPage = browsePages.find(
                (page) => page.label === upperCaseFirstLetter(splittedPath[2])
            );
            if (!selectedPage) return;
            setSelectedBrowsePage(selectedPage);
        } else {
            setIsInBrowseMode(false);
        }
    }, [pathname]);

    return (
        <div className="flex items-center border-b border-gray-300 pl-4 py-2 space-x-2 font-semibold text-lg">
            {"Browse "}
            <div className="relative">
                <button
                    className="flex-grow flex items-center justify-between w-44 px-4 mx-2 py-1 bg-white border border-gray-300 text-gray-800 rounded-md"
                    onClick={() => setIsBrowseDropdownOpen(!isBrowseDropdownOpen)}
                >
                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={selectedBrowsePage?.icon || faQuestion}
                            className="text-gray-700 small-icon mr-2"
                        />
                        {selectedBrowsePage?.label}
                    </div>
                    <FontAwesomeIcon icon={faCaretDown} className="pl-2 small-icon text-gray-700" />
                </button>
                {isBrowseDropdownOpen && (
                    <div className="absolute left-2 px-2 py-2 bg-white z-10 rounded-md shadow-md w-44 font-semibold text-gray-800">
                        {browsePages.map((page, index) => (
                            <div key={page.label} className="text-gray-700 hover:text-gray-900 p-2">
                                <button
                                    className="flex items-center"
                                    onClick={() => router.push(page.link || "")}
                                >
                                    <FontAwesomeIcon
                                        icon={page.icon || faQuestion}
                                        className="small-icon text-gray-700 mr-2"
                                    />
                                    {selectedBrowsePage === page ? (
                                        <div className="text-gray-900">{page.label}</div>
                                    ) : (
                                        <>{page.label}</>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowsePagesSelect;
