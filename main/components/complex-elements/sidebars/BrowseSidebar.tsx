"use client";

import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";
import dynamic from "next/dynamic";
import "@/styles/sidebar.scss";
import CollapsedSidebar from "./CollapsedSidebar";
import NavItemsUI from "./NavItemsUI";
import SidebarDropdown from "./SidebarDropdown";
import BrowsePagesSelect from "./BrowsePagesSelect";
import { Feature } from "@/types/infoTypes";
import { browseNavItems } from "@/config/navItems.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
const ProjectsAdvancedSearchOptions = dynamic(
    () => import("../search-options/ProjectsAdvancedSearchOptions")
);
const WorksAdvancedSearchOptions = dynamic(
    () => import("../search-options/WorksAdvancedSearchOptions")
);
const SubmissionsAdvancedSearchOptions = dynamic(
    () => import("../search-options/SubmissionsAdvancedSearchOptions")
);
const IssuesAdvancedSearchOptions = dynamic(
    () => import("../search-options/IssuesAdvancedSearchOptions")
);
const ReviewsAdvancedSearchOptions = dynamic(
    () => import("../search-options/ReviewsAdvancedSearchOptions")
);

interface BrowseSidebarProps {}

/**
 * Sidebar for the Browse pages. Used in root layout.
 */
const BrowseSidebar: React.FC<BrowseSidebarProps> = () => {
    // States
    const [selectedBrowsePage, setSelectedBrowsePage] = useState<Feature>({
        label: "Projects",
        icon: faBoxArchive,
    });

    // Contexts
    const pathname = usePathname();
    const { isSidebarOpen, isInBrowseMode } = useSidebarState();

    // Ensure the sidebar is only visible in browse mode
    if (!isInBrowseMode) {
        return null;
    }

    if (!isSidebarOpen) {
        return <CollapsedSidebar />;
    }

    return (
        <aside className="sidebar sidebar--browse">
            {/* Shade on small screens */}
            {isSidebarOpen && (
                <div className="fixed inset-0 left-72 top-16 bg-black bg-opacity-50 z-30 md:hidden"></div>
            )}

            {/* Dropdown */}
            <SidebarDropdown isInBrowseMode={true} />

            <div className="relative flex-grow overflow-y-auto">
                {pathname === "/browse" ? (
                    <ul className="space-y-3 px-6 py-4">
                        {browseNavItems.map((item) => (
                            <li
                                key={item.label}
                                className="text-lg text-gray-900"
                                style={{ fontWeight: 500 }}
                            >
                                <Link
                                    href={item?.link || ""}
                                    className="flex items-center hover:text-black"
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="small-icon text-gray-700 mr-2"
                                    />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        {/* Browse Page Select */}
                        <BrowsePagesSelect
                            selectedBrowsePage={selectedBrowsePage}
                            setSelectedBrowsePage={setSelectedBrowsePage}
                        />

                        {/* Advanced Search Options */}
                        {isInBrowseMode ? (
                            <div
                                className="flex-grow overflow-y-auto"
                                style={{ height: "calc(100vh - 4rem)" }}
                            >
                                {selectedBrowsePage?.label === "Projects" ? (
                                    <ProjectsAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage?.label === "Works" ? (
                                    <WorksAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage?.label === "Submissions" ? (
                                    <SubmissionsAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage?.label === "Issues" ? (
                                    <IssuesAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage?.label === "Reviews" ? (
                                    <ReviewsAdvancedSearchOptions />
                                ) : null}
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </aside>
    );
};

export default BrowseSidebar;
