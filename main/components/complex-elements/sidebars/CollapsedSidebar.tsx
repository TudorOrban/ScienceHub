import { useSidebarState } from "@/app/contexts/sidebar-contexts/SidebarContext";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
const Link = dynamic(() => import("next/link"));

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
                className="p-4 bg-white text-gray-800 border-b-2 border-gray-300"
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
                                                    className={`small-icon hover:text-black ${
                                                        selectedItem ===
                                                        item.link
                                                            ? "text-black"
                                                            : "text-gray-700"
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
                                    <TooltipContent className="bg-white">
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
