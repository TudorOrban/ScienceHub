import { PinnedPage } from "@/contexts/sidebar-contexts/SidebarContext";
import {
    faBars,
    faCaretDown,
    faCaretUp,
    faFileWord,
    faMapPin,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchInput from "../search-inputs/SearchInput";
import React from "react";
import { OwnershipResult, identifyOwnership } from "@/utils/identifyOwnership";
import { usePathname, useRouter } from "next/navigation";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../../ui/tooltip";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import { useEditorSidebarState } from "@/contexts/sidebar-contexts/EditorSidebarContext";
import { getIconByIconIdentifier } from "@/utils/getIconByIconIdentifier";

interface EditorSidebarDropdownProps {}

/**
 * Dropdown for the EditorSidebar.
 * To be used only once UnifiedEditor is implemented.
 */
const EditorSidebarDropdown: React.FC<EditorSidebarDropdownProps> = ({}) => {
    // Contexts
    // - Current user
    const currentUserId = useUserId();

    // Sidebar state
    const sidebarState = useEditorSidebarState();
    const {
        isEditorSidebarOpen,
        setIsEditorSidebarOpen,
        setDirectoryItems,
        selectedPage,
        setSelectedPage,
        pinnedPages,
        setPinnedPages,
        isDropdownOpen,
        setIsDropdownOpen,
    } = sidebarState;
    const router = useRouter();

    // Current user hook
    const currentUser = useUsersSmall([currentUserId || ""], !!currentUserId);

    // Handle pinned pages selection
    const handleSelectChange = async (selectedValue: PinnedPage) => {
        switch (selectedValue.label) {
            case "Home":
                router.push("/");
                break;
            case "Workspace":
                router.push("/workspace");
                break;
            case "Browse":
                router.push("/browse");
                break;
            case "Resources":
                router.push("/resources");
                break;
            case "Profile":
                if (currentUserId) {
                    router.push(`/${(currentUser || {}).data[0]?.username}/profile`);
                }
                break;
            default:
                break;
        }
    };

    const width = "256px";

    return (
        <div className="flex justify-between items-start bg-white text-gray-900 p-2 border-b-2 border-t-1 border-gray-200 z-20">
            <div className="relative flex-grow inline-block text-left z-50 ">
                {/* Title */}
                <div className="">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center w-full rounded-md capitalize py-3 text-sm font-medium h-10"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex items-center text-xl font-semibold text-gray-900">
                            <FontAwesomeIcon icon={faFileWord} className="small-icon pr-1 mr-1" />
                            <div className="truncate" style={{ maxWidth: "120px" }}>
                                {"Editor"}
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
                                <div key={page.label} className="flex items-center justify-between">
                                    <button
                                        className={`block px-4 py-2 ${
                                            selectedPage.label === page.label ? "font-bold" : ""
                                        } text-gray-700 hover:bg-gray-100`}
                                        onClick={() => handleSelectChange(page)}
                                    >
                                        <FontAwesomeIcon
                                            icon={getIconByIconIdentifier(
                                                selectedPage.iconIdentifier || "faQuestion"
                                            )}
                                            className="small-size pr-1 mr-1"
                                        />
                                        {page.label}
                                    </button>
                                    <div className="mr-4">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
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
                                    </div>
                                </div>
                            ))}
                            {!pinnedPages?.includes(selectedPage) && (
                                <div
                                    key={selectedPage.label}
                                    className="flex items-center justify-between"
                                >
                                    <button
                                        className={`block px-4 py-2 font-bold text-gray-700 hover:bg-gray-100`}
                                        onClick={() => handleSelectChange(selectedPage)}
                                    >
                                        <FontAwesomeIcon
                                            icon={getIconByIconIdentifier(
                                                selectedPage.iconIdentifier || "faQuestion"
                                            )}
                                            className="small-size pr-1 mr-1"
                                        />
                                        {selectedPage.label}
                                    </button>
                                    <div className="mr-4">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
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
                    setIsEditorSidebarOpen(!isEditorSidebarOpen);
                }}
            >
                {isEditorSidebarOpen ? (
                    <FontAwesomeIcon icon={faBars} className="small-size" />
                ) : (
                    <FontAwesomeIcon icon={faBars} className="small-size" />
                )}
            </button>
        </div>
    );
};

export default EditorSidebarDropdown;
