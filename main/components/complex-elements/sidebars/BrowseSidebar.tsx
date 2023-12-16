"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";
import dynamic from "next/dynamic";
import { browseNavItems } from "@/config/navItems.config";
import { Button } from "../../ui/button";
import "@/styles/sidebar.scss";

const SidebarDropdown = dynamic(
    () => import("@/components/complex-elements/sidebars/SidebarDropdown")
);
const CollapsedSidebar = dynamic(
    () => import("@/components/complex-elements/sidebars/CollapsedSidebar")
);
const NavItemsUI = dynamic(
    () => import("@/components/complex-elements/sidebars/NavItemsUI")
);

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

const BrowseSidebar: React.FC<BrowseSidebarProps> = () => {
    // States
    const [selectedBrowsePage, setSelectedBrowsePage] = useState<string>();
    const browsePages = [
        "Projects",
        "Works",
        "Submissions",
        "Issues",
        "Reviews",
        "Discussions",
        "People",
    ];
    const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] =
        useState<boolean>(false);

    // Hooks
    const router = useRouter();
    const pathname = usePathname();

    const sidebarState = useSidebarState();
    const { isSidebarOpen, isInBrowseMode, setIsInBrowseMode, setNavItems } =
        sidebarState;

    // Handle Browse page selection
    const handleSelectPageChange = async (selectedValue: string) => {
        switch (selectedValue) {
            case "Projects":
                router.push("/browse/projects");
                break;
            case "Works":
                router.push("/browse/works");
                break;
            case "Submissions":
                router.push("/browse/submissions");
                break;
            case "Issues":
                router.push("/browse/issues");
                break;
            case "Reviews":
                router.push("/browse/reviews");
                break;
            case "Discussions":
                router.push("/browse/discussions");
                break;
            case "People":
                router.push("/browse/people");
                break;
            default:
                break;
        }
    };

    // Manage browse mode and items based on pathname
    useEffect(() => {
        const splittedPath = pathname.split("/");
        if (splittedPath[1] === "browse") {
            setIsInBrowseMode(true);
            setNavItems(browseNavItems);
            if (splittedPath[2]) {
                setSelectedBrowsePage(
                    splittedPath[2].charAt(0).toUpperCase() +
                        splittedPath[2].slice(1)
                );
            }
        } else {
            setIsInBrowseMode(false);
        }
    }, [pathname]);

    if (!isInBrowseMode) {
        return null;
    }

    if (!isSidebarOpen) {
        return <CollapsedSidebar />;
    }

    return (
        <aside className="sidebar sidebar--browse">
            <SidebarDropdown isInBrowseMode={true} />

            <div className="relative flex-grow overflow-y-auto">
                {pathname === "/browse" ? (
                    <>
                        <NavItemsUI />
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between border-b border-gray-200 pl-4 py-2 font-semibold text-lg">
                            {"Browse "}
                            <button
                                className="flex-grow flex justify-start items-center px-2 mx-2 py-1 bg-white border border-gray-200 rounded-md"
                                onClick={() =>
                                    setIsBrowseDropdownOpen(
                                        !isBrowseDropdownOpen
                                    )
                                }
                            >
                                {selectedBrowsePage}
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className="pl-2"
                                />
                            </button>
                            <div className="flex justify-end pr-3">
                                <Button className="w-12 h-9">Clear</Button>
                            </div>
                        </div>
                        {isBrowseDropdownOpen && (
                            <div className="absolute left-20 px-2 py-2 bg-white z-10 rounded-md shadow-md w-30 font-semibold text-gray-800">
                                {browsePages.map((page, index) => (
                                    <div
                                        key={page}
                                        className="text-gray-600 hover:text-gray-900 p-2"
                                    >
                                        <button
                                            onClick={() =>
                                                handleSelectPageChange(page)
                                            }
                                        >
                                            {selectedBrowsePage === page ? (
                                                <div className="text-gray-900">
                                                    {page}
                                                </div>
                                            ) : (
                                                <>{page}</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isInBrowseMode ? (
                            <div
                                className="flex-grow overflow-y-auto"
                                style={{ height: "calc(100vh - 4rem)" }}
                            >
                                {selectedBrowsePage === "Projects" ? (
                                    <ProjectsAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage === "Projects" ? (
                                    <ProjectsAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage === "Works" ? (
                                    <WorksAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage === "Submissions" ? (
                                    <SubmissionsAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage === "Issues" ? (
                                    <IssuesAdvancedSearchOptions />
                                ) : null}
                                {selectedBrowsePage === "Reviews" ? (
                                    <ReviewsAdvancedSearchOptions />
                                ) : null}
                            </div>
                        ) : null}
                    </>
                )}
            </div>
            {/* </div> */}
            <div className="text-gray-100 text-xs"></div>
        </aside>
    );
};

export default BrowseSidebar;
