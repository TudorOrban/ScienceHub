import { PinnedPage, useSidebarState } from "@/src/contexts/sidebar-contexts/SidebarContext";
import { faBars, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import {
    browseNavItems,
    getProjectNavItems,
    getProfileNavItems,
    resourcesNavItems,
    workspaceNavItems,
    homeNavItems,
} from "@/src/config/navItems.config";
import { useUserSettingsContext } from "@/src/contexts/current-user/UserSettingsContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { upperCaseFirstLetter } from "@/src/utils/functions";
import { getIconByIconIdentifier } from "@/src/utils/getIconByIconIdentifier";
import PinnedPagesResults from "./PinnedPagesResults";

interface SidebarDropdownProps {
    isInBrowseMode?: boolean;
}

/**
 * Dropdown component for the Sidebar and BrowseSidebar.
 * Responsible for getting navItems based on pathname, managing pinned pages.
 */
const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ isInBrowseMode }) => {
    const width = isInBrowseMode ? "288px" : "256px";

    // States
    const [inputQuery, setInputQuery] = useState("");

    // Contexts
    const currentUserId = useUserId();
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        setNavItems,
        selectedPage,
        setSelectedPage,
        pinnedPages,
        setPinnedPages,
        isDropdownOpen,
        setIsDropdownOpen,
    } = useSidebarState();
    const pathname = usePathname();
    const supabase = useSupabaseClient();
    const { userSettings } = useUserSettingsContext();

    // Get pinned pages from user settings context
    useEffect(() => {
        if (userSettings.status === "success" && userSettings.data[0]?.pinnedPages) {
            setPinnedPages(userSettings.data[0]?.pinnedPages);
        }
    }, [userSettings.data]);

    // Handle nav items and selected page upon navigation
    useEffect(() => {
        const splittedPath = pathname.split("/");

        const rootFolderKey = splittedPath[1];
        const upperCase = upperCaseFirstLetter(rootFolderKey);
        const pinnedPagesKeys = pinnedPages.map((page) => page.label);

        let selectedPage: PinnedPage = {
            label: "default",
            link: "",
            iconIdentifier: "faQuestion",
        };

        // Sync selected pinned page
        if (pinnedPagesKeys.includes(upperCase)) {
            selectedPage = pinnedPages.find((page) => page.label === upperCase) || selectedPage;
        } else if (rootFolderKey === "" && pinnedPagesKeys.includes("Home")) {
            selectedPage = pinnedPages.find((page) => page.label === "Home") || selectedPage;
        }
        if (selectedPage.label !== "default") {
            setSelectedPage(selectedPage);
        }

        // Configuration of state behavior based on the path
        handleNavigation(splittedPath, rootFolderKey);
        
    }, [pathname]);

    const handleNavigation = (splittedPath: string[], rootFolderKey: string) => {
        if (rootFolderKey === "") {
            setNavItems(homeNavItems);
        } else if (rootFolderKey === "workspace") {
            setNavItems(workspaceNavItems);
        } else if (rootFolderKey === "browse") {
            setNavItems(browseNavItems);
        } else if (rootFolderKey === "resources") {
            setNavItems(resourcesNavItems);
        } else {
            // Identifier pages
            if (splittedPath[2] === "projects" && !!splittedPath[3]) {
                // Project pages
                setNavItems(getProjectNavItems(splittedPath[1], splittedPath[3]));
                setSelectedPage({
                    label: splittedPath[3],
                    link: pathname,
                    iconIdentifier: "faBoxArchive",
                });
            } else if (splittedPath[2] === "profile" && !rootFolderKey.includes("~")) {
                handleFetchUserData(rootFolderKey);
            }
        }
    }

    const handleFetchUserData = async (rootFolderKey: string) => {
        // User pages, get user data
        const fetchUserData = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("id, username, full_name")
                .eq("username", rootFolderKey)
                .single();

            if (error) {
                console.error("Could not find user: ", error);
            } else {
                setNavItems(getProfileNavItems(rootFolderKey, data?.id === currentUserId));
                setSelectedPage({
                    label: data?.username,
                    link: `/${data?.username}/profile`,
                    iconIdentifier: "faUser",
                });
            }
        };

        fetchUserData();
    }

    return (
        <div
            className={`sidebar-dropdown ${
                !isInBrowseMode ? "sidebar-dropdown--default" : "sidebar-dropdown--browse"
            }`}
        >
            <div className="relative flex-grow inline-block text-left z-50 ">
                {/* Title */}
                <div className="">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center w-full rounded-md capitalize py-3 text-sm font-medium h-10"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex items-center pl-2 pt-0.5 text-xl font-semibold text-gray-100">
                            <FontAwesomeIcon
                                icon={getIconByIconIdentifier(
                                    selectedPage.iconIdentifier || "faQuestion"
                                )}
                                className="small-icon text-gray-200 pr-1 mr-1"
                            />
                            <div className="truncate" style={{ maxWidth: "150px", fontSize: "1.1rem" }}>
                                {selectedPage.label || ""}
                            </div>
                        </div>
                        <FontAwesomeIcon
                            icon={isDropdownOpen ? faCaretUp : faCaretDown}
                            className="small-icon text-gray-200 ml-2"
                            style={{ marginTop: "3px" }}
                        />
                    </button>
                </div>

                {/* Dropdown list */}
                {isDropdownOpen && (
                    <div
                        className="fixed left-0 right-10 mt-2 mr-20 rounded-md shadow-xl border-2 border-gray-700 z-50"
                        style={{ width: width }}
                    >
                        {/* TODO: Add searchbar back in and implement functionality*/}
                        {/* <SidebarSearchInput
                            inputQuery={inputQuery}
                            setInputQuery={setInputQuery}
                        /> */}
                        <PinnedPagesResults
                            pinnedPages={pinnedPages}
                            setPinnedPages={setPinnedPages}
                            selectedPage={selectedPage}
                            setSelectedPage={setSelectedPage}
                            inputQuery={inputQuery}
                            setInputQuery={setInputQuery}
                        />
                    </div>
                )}
            </div>
            <button
                className="ml-4 mr-2 z-20"
                style={{ marginTop: "9px" }}
                onClick={() => {
                    setIsSidebarOpen(!isSidebarOpen);
                }}  
            >
                <FontAwesomeIcon icon={faBars} className="small-size text-gray-200" />
            </button>
        </div>
    );
};

export default SidebarDropdown;
