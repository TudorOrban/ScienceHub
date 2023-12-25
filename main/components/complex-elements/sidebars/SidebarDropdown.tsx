import { PinnedPage, useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";
import {
    faBars,
    faCaretDown,
    faCaretUp,
    faMapPin,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchInput from "../SearchInput";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../../ui/tooltip";
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

interface SidebarDropdownProps {
    isInBrowseMode?: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ isInBrowseMode }) => {
    const width = isInBrowseMode ? "288px" : "256px";

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
    const router = useRouter();
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

    // Handle Pin/Unpin Page
    const handlePinPage = async (pinnedPage: PinnedPage) => {
        const isAlreadyPinned = pinnedPages?.map((page) => page.label).includes(pinnedPage.label);

        if (currentUserId && pinnedPages && !isAlreadyPinned) {
            // Update the database
            const { error } = await supabase
                .from("user_settings")
                .update([
                    {
                        pinned_pages: [
                            ...(pinnedPages || []),
                            {
                                label: pinnedPage.label,
                                link: pinnedPage.link,
                                iconIdentifier: pinnedPage.iconIdentifier,
                            } as PinnedPage,
                        ],
                    },
                ])
                .eq("user_id", currentUserId);

            if (error) {
                console.error("Could not pin page: ", error);
            } else {
                setPinnedPages([...pinnedPages, pinnedPage]);
            }
        }
    };

    const handleUnPinPage = async (pinnedPage: PinnedPage) => {
        const isAlreadyPinned = pinnedPages?.map((page) => page.label).includes(pinnedPage.label);

        if (currentUserId && pinnedPages && isAlreadyPinned) {
            // Update the database
            const newPinnedPages = pinnedPages.filter((page) => page.label !== pinnedPage.label);
            const selPage = selectedPage;
            const { error } = await supabase
                .from("user_settings")
                .update([
                    {
                        pinned_pages: newPinnedPages,
                    },
                ])
                .eq("user_id", currentUserId);

            if (error) {
                console.error("Could not pin page: ", error);
            } else {
                setPinnedPages(newPinnedPages);
                setSelectedPage(selPage);
            }
        }
    };

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
                        className="fixed left-0 right-10 mt-3 mr-20 rounded-md shadow-xl border-2 border-gray-200 bg-white z-50"
                        style={{ width: width }}
                    >
                        <SearchInput
                            placeholder={"Search ScienceHub"}
                            context="Sidebar"
                            searchMode={"onClick"}
                        />
                        <div className="py-1 shadow-md space-y-1">
                            {pinnedPages?.map((page) => (
                                <div key={page.label} className="flex items-center justify-between">
                                    <button
                                        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                                            selectedPage.label === page.label ? "font-bold" : ""
                                        }`}
                                        onClick={() => router.push(page.link)}
                                    >
                                        <FontAwesomeIcon
                                            icon={getIconByIconIdentifier(
                                                page.iconIdentifier || "faQuestion"
                                            )}
                                            className="small-size pr-1 mr-1"
                                        />
                                        {page.label}
                                    </button>
                                    <button
                                        onClick={() => handleUnPinPage(page)}
                                        className="flex items-center justify-center w-6 h-6 mr-4 bg-gray-100 rounded-md border border-gray-200"
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <FontAwesomeIcon
                                                        icon={faMapPin}
                                                        className="small-icon text-gray-600"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white p-2 font-semibold">
                                                    Pin to Sidebar
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </button>
                                </div>
                            ))}
                            {!pinnedPages
                                .map((page) => page.label)
                                ?.includes(selectedPage.label) && (
                                <div
                                    key={selectedPage.label}
                                    className="flex items-center justify-between"
                                >
                                    <button
                                        className={`block px-4 py-2 font-bold text-gray-700 hover:bg-gray-100`}
                                        onClick={() => router.push(selectedPage.link)}
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                getIconByIconIdentifier(
                                                    selectedPage.iconIdentifier || "faQuestion"
                                                ) || faQuestion
                                            }
                                            className="small-size pr-1 mr-1"
                                        />
                                        {selectedPage.label}
                                    </button>
                                    <div className="mr-4">
                                        <button onClick={() => handlePinPage(selectedPage)}>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <FontAwesomeIcon
                                                            icon={faMapPin}
                                                            className="small-icon text-gray-300"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-white p-2 font-semibold">
                                                        Pin to Sidebar
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
