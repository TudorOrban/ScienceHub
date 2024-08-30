import { useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Component displaying Sidebar's nav items.
 */
const NavItemsUI = () => {
    // States
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

    // Contexts
    const { navItems, selectedItem, setSelectedItem, areSubItemsVisible } = useSidebarState();
    const pathname = usePathname();

    // navItems Dropdowns
    const handleExpandSubitems = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setActiveIndices((prevActiveIndices) => {
            if (prevActiveIndices.includes(index)) {
                return prevActiveIndices.filter((activeIndex) => activeIndex !== index);
            } else {
                return [...prevActiveIndices, index];
            }
        });
    };

    useEffect(() => {
        let newActiveIndices: number[] = [];

        if (areSubItemsVisible) {
            newActiveIndices = navItems
                .map((item, index) => {
                    // Exclude the item with label "Tools" from being active if it exists
                    return item.label !== "Tools" ? index : 0;
                })
                .filter((index) => index !== null);
        } else {
            navItems.forEach((item, index) => {
                if (item.subItems && item.label !== "Tools") {
                    // Check for "Tools" here as well
                    item.subItems.forEach((subItem) => {
                        if (subItem.link === pathname) {
                            newActiveIndices.push(index);
                        }
                    });
                } else if (item.link === pathname && item.label !== "Tools") {
                    newActiveIndices.push(index);
                }
            });
        }

        setActiveIndices(newActiveIndices);
    }, [areSubItemsVisible, navItems, pathname]);

    return (
        <div className="flex-grow pl-6 pr-4 py-4 overflow-y-auto text-gray-800" style={{ height: "calc(100vh - 8rem)", fontWeight: 600, fontSize: 18 }}>
            <ul className="flex-grow space-y-4">
                {navItems.map((item, index) => (
                    <li
                        key={item.link ?? index}
                        className="rounded transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div className="min-w-20">
                                {item.link ? (
                                    <Link
                                        href={item.link}
                                        onClick={() => setSelectedItem(item.link ?? "no link")}
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-4 text-gray-700"
                                            />
                                        )}

                                        <span className={`${selectedItem === item.link ? "text-blue-700" : "hover:text-blue-700"}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                ) : (
                                    <div className="whitespace-nowrap">
                                        {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-4 text-gray-700"
                                            />
                                        )}
                                        <span className="">
                                            {item.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {item.subItems && (
                                <button
                                    className="ml-2 rounded text-gray-700"
                                    onClick={(event) => handleExpandSubitems(index, event)}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            activeIndices.includes(index) ? faCaretUp : faCaretDown
                                        }
                                        className="mr-1"
                                    />
                                </button>
                            )}
                        </div>
                        {item.subItems && activeIndices.includes(index) && (
                            <ul className="ml-2 text-base space-y-4 pt-4">
                                {item.subItems.map((subItem, index) => (
                                    <li
                                        key={subItem.label ?? index}
                                        className={`rounded transition-colors duration-200 hover:text-black`}
                                    >
                                        <Link
                                            href={subItem.link ?? "/"}
                                            onClick={() => setSelectedItem(subItem.link ?? "")}
                                        >
                                            <div
                                                className="flex items-center"
                                                style={{
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {subItem.icon && (
                                                    <FontAwesomeIcon
                                                        icon={subItem.icon}
                                                        className="small-icon mr-4 text-gray-700"
                                                    />
                                                )}
                                                
                                            <span className={`${selectedItem === subItem.link ? "text-blue-700" : "hover:text-blue-700"}`}>
                                                {subItem.label}
                                            </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <div className="text-gray-100 text-xs">blank</div>
        </div>
    );
};

export default NavItemsUI;
