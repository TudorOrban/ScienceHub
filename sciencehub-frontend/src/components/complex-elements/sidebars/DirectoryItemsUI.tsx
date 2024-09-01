import { useEditorSidebarState } from "@/src/contexts/sidebar-contexts/EditorSidebarContext";
import { workTypeIconMap } from "@/src/components/cards/small-cards/SmallWorkCard";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Component for displaying a project's directory in the sidebar.
 * To be used only once UnifiedEditor is implemented.
 */
const DirectoryItemsUI = () => {
    // States
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

    // Contexts
    const { directoryItems, selectedItem, setSelectedItem, areSubItemsVisible } =
        useEditorSidebarState();
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
            newActiveIndices = directoryItems.map((_, index) => index);
        } else {
            directoryItems.forEach((item, index) => {
                if (item.subItems) {
                    item.subItems.forEach((subItem) => {
                        //         if (subItem.link === pathname) {
                        newActiveIndices.push(index);
                        //         }
                    });
                    // } else if (item.link === pathname) {
                    //     newActiveIndices.push(index);
                }
            });
        }

        setActiveIndices(newActiveIndices);
    }, [areSubItemsVisible, directoryItems, pathname]);

    return (
        <div
            className="flex-grow overflow-y-auto overflow-x-hidden"
            style={{ height: "calc(100vh - 8rem)" }}
        >
            <ul className="flex-grow">
                {directoryItems.map((item, index) => (
                    <li
                        key={index}
                        className="my-4 pl-4 pr-2 rounded transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {/* {item.link ? (
                                    <Link
                                        href={item.link}
                                        onClick={() =>
                                            setSelectedItem(
                                                item.link || "no link"
                                            )
                                        }
                                    >
                                        {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-2 text-gray-700"
                                            />
                                        )}

                                        {selectedItem === item.link ? (
                                            <span className="font-semibold text-gray-900">
                                                {item.label}
                                            </span>
                                        ) : (
                                            <span className="text-gray-800">
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                ) : ( */}
                                <>
                                    {/* {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-2 text-gray-700"
                                            />
                                        )} */}
                                    {item.itemType && (
                                        <FontAwesomeIcon
                                            icon={workTypeIconMap(item.itemType).icon}
                                            className="small-icon mr-1.5"
                                            style={{
                                                color: workTypeIconMap(item.itemType).color,
                                            }}
                                        />
                                    )}
                                    <span
                                        className={`flex whitespace-nowrap  text-clip overflow-x-hidden ${
                                            item.isModified ? "text-blue-700" : "text-gray-800"
                                        }`}
                                    >
                                        {item.title}
                                    </span>
                                </>
                                {/* )} */}
                            </div>

                            {item.subItems && item.subItems.length > 0 && (
                                <button
                                    className="ml-2 rounded text-gray-800"
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
                        <AnimatePresence>
                            {item.subItems && activeIndices.includes(index) && (
                                <motion.ul
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="ml-1 mt-3 text-base"
                                >
                                    {item.subItems.map((subItem, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-center mt-2 py-1 pl-2 pr-2 rounded transition-colors duration-200 hover:bg-gray-200`}
                                        >
                                            {/* <Link
                                                href={subItem.link || "/"}
                                                onClick={() =>
                                                    setSelectedItem(
                                                        subItem.link || ""
                                                    )
                                                }
                                            >
                                                <div className="flex items-center">
                                                    {subItem.icon && (
                                                        <FontAwesomeIcon
                                                            icon={subItem.icon}
                                                            className="small-icon mr-2 text-gray-700"
                                                        />
                                                    )}
                                                    {selectedItem ===
                                                    subItem.link ? (
                                                        <span className="font-semibold text-gray-900">
                                                            {subItem.label}
                                                        </span>
                                                    ) : ( */}
                                            {item.itemType && (
                                                <FontAwesomeIcon
                                                    icon={workTypeIconMap(subItem.itemType).icon}
                                                    className="small-icon mr-1.5"
                                                    style={{
                                                        color: workTypeIconMap(subItem.itemType)
                                                            .color,
                                                    }}
                                                />
                                            )}
                                            <span className="flex whitespace-nowrap text-gray-800 overflow-x-hidden overflow-ellipsis">
                                                {subItem.title}
                                            </span>
                                            {/* )}
                                                </div>
                                            </Link> */}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </li>
                ))}
            </ul>

            <div className="text-gray-100 text-xs">blank</div>
        </div>
    );
};

export default DirectoryItemsUI;
