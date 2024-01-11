import { useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NavItemsUI = () => {
    // States
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

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
                    // Check label here as well
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
        <div className="flex-grow pl-4 overflow-y-auto" style={{ height: "calc(100vh - 8rem)" }}>
            <ul className="flex-grow">
                {navItems.map((item, index) => (
                    <li
                        key={item.link || index}
                        className="my-3 px-2 rounded transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div className="min-w-20">
                                {item.link ? (
                                    <Link
                                        href={item.link}
                                        onClick={() => setSelectedItem(item.link || "no link")}
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-2 text-gray-700"
                                            />
                                        )}

                                        {selectedItem === item.link ? (
                                            <span className="font-semibold text-black">
                                                {item.label}
                                            </span>
                                        ) : (
                                            <span
                                            style={{ fontWeight: 500 }}
                                                className="text-gray-700 hover:text-black hover:font-semibold"
                                            >
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                ) : (
                                    <div
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-2 text-gray-700"
                                            />
                                        )}
                                        <span className="text-gray-900 hover:font-semibold" style={{ fontWeight: 500 }}>{item.label}</span>
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
                        {/* <AnimatePresence> */}
                        {item.subItems && activeIndices.includes(index) && (
                            // <motion.ul
                            //     initial={{ height: 0 }}
                            //     animate={{ height: "auto" }}
                            //     exit={{ height: 0 }}
                            //     className="ml-2 mt-2 text-base"
                            // >
                            <ul className="ml-2 mt-2 text-base">
                                {item.subItems.map((subItem, index) => (
                                    <li
                                        key={index}
                                        className={`my-1.5 py-1 pl-2 pr-2 rounded transition-colors duration-200 hover:text-black hover:font-semibold`}
                                    >
                                        <Link
                                            href={subItem.link || "/"}
                                            onClick={() => setSelectedItem(subItem.link || "")}
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
                                                        className="small-icon mr-2 text-gray-700"
                                                    />
                                                )}
                                                {selectedItem === subItem.link ? (
                                                    <span className="font-semibold text-black">
                                                        {subItem.label}
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="text-gray-900 hover:text-black hover:font-semibold"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        {subItem.label}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            // </motion.ul>
                        )}
                        {/* </AnimatePresence> */}
                    </li>
                ))}
            </ul>

            <div className="text-gray-100 text-xs">blank</div>
        </div>
    );
};

export default NavItemsUI;
