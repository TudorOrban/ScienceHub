import { useSidebarState } from "@/src/contexts/sidebar-contexts/SidebarContext";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
const Link = dynamic(() => import("next/link"));

/**
 * Collapsed sidebar. Used in both Sidebar and BrowseSidebar
 */
const CollapsedSidebar = () => {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        navItems,
        selectedItem,
        setSelectedItem,
    } = useSidebarState();
    
    return (
        <aside className="sidebar sidebar--collapsed">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-4 border-b-2 border-gray-700"
            >
                <FontAwesomeIcon icon={faBars} />
            </button>
            <ul className="flex-grow justify-center px-4">
                {navItems.map((item, index) => (
                    <li
                        key={item.link || index}
                        className="my-4 rounded transition-colors duration-200"
                    >
                        {item.icon ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        {item.link ? (
                                            <Link
                                                href={item.link}
                                                onClick={() =>
                                                    setSelectedItem(
                                                        item.link || "no link"
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={item.icon}
                                                    className={`small-icon hover:text-blue-600 ${
                                                        selectedItem ===
                                                        item.link
                                                            ? "text-blue-600"
                                                            : "text-gray-200"
                                                    }`}
                                                />
                                            </Link>
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon text-gray-700 hover:text-gray-900"
                                            />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-black">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : null}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default CollapsedSidebar;
