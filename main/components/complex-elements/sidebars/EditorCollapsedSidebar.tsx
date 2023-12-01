import { useEditorSidebarState } from "@/app/contexts/sidebar-contexts/EditorSidebarContext";
import { workTypeIconMap } from "@/components/elements/SmallWorkCard";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const EditorCollapsedSidebar = () => {
    const { isEditorSidebarOpen, setIsEditorSidebarOpen, directoryItems } =
        useEditorSidebarState();
    return (
        <aside
            className={`w-12 h-full bg-gray-100 border-r border-gray-300 rounded-tr-lg rounded-br-lg flex flex-col shadow-lg overflow-y-auto`}
        >
            <div className="flex justify-between items-center p-4 bg-white text-gray-800 border-b-2 border-gray-300">
                <button
                    onClick={() => setIsEditorSidebarOpen(!isEditorSidebarOpen)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <ul className="flex-grow px-4">
                {directoryItems.map((item, index) => (
                    <li
                        key={index}
                        className="my-3 py-2 pr-1 rounded transition-colors duration-200 hover:bg-gray-200"
                    >
                        {/* {item.link ? (
                                <Link href={item.link}>
                                    <div className="flex items-center cursor-pointer">
                                        {item.icon && (
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="small-icon mr-2 text-gray-700"
                                            />
                                        )}
                                    </div>
                                </Link>
                            ) : ( */}
                        <div className="flex items-center">
                            {/* {item.itemType && (
                                <FontAwesomeIcon
                                    icon={workTypeIconMap(item.itemType).icon}
                                    className="small-icon mr-1"
                                    style={{
                                        color: workTypeIconMap(item.itemType)
                                            .color,
                                    }}
                                />
                            )} */}
                        </div>
                        {/* )} */}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default EditorCollapsedSidebar;
