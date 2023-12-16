import {
    PinnedPage,
    useSidebarState,
} from "@/contexts/sidebar-contexts/SidebarContext";
import {
    faBars,
    faBoxArchive,
    faCaretDown,
    faCaretUp,
    faMapPin,
    faQuestion,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchInput from "../SearchInput";
import React, { useEffect } from "react";
import { OwnershipResult, identifyOwnership } from "@/utils/identifyOwnership";
import { usePathname, useRouter } from "next/navigation";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "../../ui/tooltip";
import {
    browseNavItems,
    getProjectNavItems,
    getProfileNavItems,
    resourcesNavItems,
    workspaceNavItems,
} from "@/config/navItems.config";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import { Button } from "@/components/ui/button";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { UserSettings } from "@/types/userTypes";
import useUserSettings from "@/hooks/utils/useUserSettings";
import { useUserSettingsContext } from "@/contexts/current-user/UserSettingsContext";
import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";

interface SidebarDropdownProps {
    isInBrowseMode?: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
    isInBrowseMode,
}) => {
    // States
    const [identifierInfo, setIdentifierInfo] =
        React.useState<OwnershipResult | null>(null);

    // Contexts
    // - Current user
    const currentUserId = useUserId();

    // Sidebar state
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

    const router = useRouter();
    const pathname = usePathname();

    const { userSettings, setUserSettings } = useUserSettingsContext();

    // Custom hooks
    const currentUser = useUsersSmall([currentUserId || ""], !!currentUserId);

    // Handle pinned pages selection
    const handlePinnedPagesNavigation = async (page: PinnedPage) => {
        router.push(page.link);
    };

    // Handle nav items and selected page upon navigation
    useEffect(() => {
        const splittedPath = pathname.split("/");

        const rootFolderKey =
            splittedPath[1].charAt(0).toUpperCase() + splittedPath[1].slice(1);
        const pinnedPagesKeys = pinnedPages.map((page) => page.label);

        let selectedPage: PinnedPage = {
            label: "default",
            link: "",
            icon: faQuestion,
            iconIdentifier: "faQuestion",
        };

        // Sync selected pinned page
        if (pinnedPagesKeys.includes(rootFolderKey)) {
            selectedPage = pinnedPages.find(
                (page) => page.label === rootFolderKey
            ) || {
                label: "default",
                link: "",
                icon: faQuestion,
                iconIdentifier: "faQuestion",
            };
        }

        // Configuration of state behavior based on the path
        switch (rootFolderKey) {
            case "":
                setIsSidebarOpen(false);
                setNavItems([]);
                setSelectedPage(selectedPage);
                break;
            case "Workspace":
                setNavItems(workspaceNavItems);
                setSelectedPage(selectedPage);
                break;
            case "Browse":
                setNavItems(browseNavItems);
                setSelectedPage(selectedPage);
                break;
            case "Resources":
                setNavItems(resourcesNavItems);
                setSelectedPage(selectedPage);
                break;
        }
        if (splittedPath[2] === "profile") {
            setNavItems(getProfileNavItems(currentUser.data[0]?.username));
            setSelectedPage({ label: "Profile", link: pathname, icon: faUser });
        } else if (
            splittedPath[1] !== "workspace" &&
            splittedPath[1] !== "browse" &&
            splittedPath[2] === "projects"
        ) {
            // Project page
            setNavItems(getProjectNavItems(splittedPath[1], splittedPath[3]));
            setSelectedPage({
                label: splittedPath[3],
                link: pathname,
                icon: faBoxArchive,
                iconIdentifier: "faBoxArchive",
            });
        }
        if (splittedPath[3] === "editor" && isSidebarOpen) {
            console.log("TRIGERRED");
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    const width = isInBrowseMode ? "288px" : "256px";

    // Handle Pin/Unpin Page
    const { mutateAsync: updateUserSettingsMutation } = useUpdateGeneralData();

    const handlePinPage = async (pinnedPage: PinnedPage) => {
        const isAlreadyPinned = userSettings.data[0].pinnedPages
            ?.map((page) => page.label)
            .includes(pinnedPage.label);

        if (currentUserId && !isAlreadyPinned) {
            // Update the database
            await updateUserSettingsMutation({
                tableName: "user_settings",
                identifierField: "user_id",
                identifier: currentUserId,
                updateFields: {
                    pinned_pages: [
                        ...(userSettings.data[0].pinnedPages || []),
                        {
                            label: pinnedPage.label,
                            link: pinnedPage.link,
                            iconIdentifier: pinnedPage.iconIdentifier,
                        } as PinnedPage,
                    ],
                },
            });
        }
        userSettings.refetch?.();
    };

    const handleUnPinPage = async (pinnedPage: PinnedPage) => {
        const isAlreadyPinned = userSettings.data[0].pinnedPages
            ?.map((page) => page.label)
            .includes(pinnedPage.label);

        if (currentUserId && isAlreadyPinned) {
            // Update the database
            await updateUserSettingsMutation({
                tableName: "user_settings",
                identifierField: "user_id",
                identifier: currentUserId,
                updateFields: {
                    pinned_pages: (
                        userSettings.data[0].pinnedPages || []
                    ).filter((page) => page.label !== pinnedPage.label),
                },
            });
        }
        userSettings.refetch?.();
    };

    return (
        <div
            className={`sidebar-dropdown ${
                !isInBrowseMode
                    ? "sidebar-dropdown--default"
                    : "sidebar-dropdown--browse"
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
                                icon={selectedPage.icon || faQuestion}
                                className="small-icon pr-1 mr-1"
                            />
                            <div
                                className="truncate"
                                style={{ maxWidth: "120px" }}
                            >
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
                        <div className="">
                            <SearchInput
                                placeholder={"Search ScienceHub"}
                                context="Sidebar"
                                searchMode={"onClick"}
                            />
                        </div>
                        <div className="py-1 shadow-md space-y-1">
                            {pinnedPages?.map((page) => (
                                <div
                                    key={page.label}
                                    className="flex items-center justify-between"
                                >
                                    <button
                                        className={`flex items-center px-4 py-2 ${
                                            selectedPage.label === page.label
                                                ? "font-bold"
                                                : ""
                                        } text-gray-700 hover:bg-gray-100`}
                                        onClick={() =>
                                            handlePinnedPagesNavigation(page)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={page.icon || faQuestion}
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
                                        onClick={() =>
                                            handlePinnedPagesNavigation(
                                                selectedPage
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                selectedPage.icon || faQuestion
                                            }
                                            className="small-size pr-1 mr-1"
                                        />
                                        {selectedPage.label}
                                    </button>
                                    <div className="mr-4">
                                        <button
                                            onClick={() =>
                                                handlePinPage(selectedPage)
                                            }
                                        >
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
