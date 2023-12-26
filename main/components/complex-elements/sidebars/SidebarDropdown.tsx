import { PinnedPage, useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";
import {
    faBars,
    faCaretDown,
    faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import {
    browseNavItems,
    getProjectNavItems,
    getProfileNavItems,
    resourcesNavItems,
    workspaceNavItems,
} from "@/config/navItems.config";
import { useUserSettingsContext } from "@/contexts/current-user/UserSettingsContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { upperCaseFirstLetter } from "@/utils/functions";
import { getIconByIconIdentifier } from "@/utils/getIconByIconIdentifier";
import PinnedPagesResults from "../search-inputs/PinnedPagesResults";

interface SidebarDropdownProps {
    isInBrowseMode?: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ isInBrowseMode }) => {
    const width = isInBrowseMode ? "288px" : "256px";
    const [inputQuery, setInputQuery] = useState("");

    // Contexts
    // - Current user
    const currentUserId = useUserId();

    // - Sidebar state
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

    // - Utils
    const pathname = usePathname();
    const supabase = useSupabaseClient();

    const { userSettings, setUserSettings } = useUserSettingsContext();

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
            selectedPage = pinnedPages.find((page) => page.label === upperCase) || {
                label: "default",
                link: "",
                iconIdentifier: "faQuestion",
            };
        }
        setSelectedPage(selectedPage);

        // Configuration of state behavior based on the path
        if (rootFolderKey === "") {
            setIsSidebarOpen(false);
            setNavItems([]);
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
            } else {
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
                        setNavItems(getProfileNavItems(data?.username, data?.id === currentUserId));
                        setSelectedPage({
                            label: data?.full_name,
                            link: `${data?.username}/profile`,
                            iconIdentifier: "faUser",
                        });
                    }
                };

                if (!rootFolderKey.includes("~")) {
                    fetchUserData();
                }
            }
        }
    }, [pathname]);
    
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
                        <div className="flex items-center text-xl font-semibold text-gray-900">
                            <FontAwesomeIcon
                                icon={getIconByIconIdentifier(
                                    selectedPage.iconIdentifier || "faQuestion"
                                )}
                                className="small-icon pr-1 mr-1"
                            />
                            <div className="truncate" style={{ maxWidth: "120px" }}>
                                {selectedPage.label || ""}
                            </div>
                        </div>
                        <FontAwesomeIcon
                            icon={isDropdownOpen ? faCaretUp : faCaretDown}
                            className="small-icon ml-2"
                            style={{ marginTop: "3px" }}
                        />
                    </button>
                </div>

                {/* Dropdown list */}
                {isDropdownOpen && (
                    <div
                        className="fixed left-0 right-10 mt-2 mr-20 rounded-md shadow-xl border-2 border-gray-200 bg-white z-50"
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
                {isSidebarOpen ? (
                    <FontAwesomeIcon icon={faBars} className="small-size" />
                ) : (
                    <FontAwesomeIcon icon={faBars} className="small-size" />
                )}
            </button>
        </div>
    );
};

export default SidebarDropdown;
