import { NavItem } from "@/src/types/infoTypes";
import Link from "next/link";

type NavigationMenuProps = {
    items: NavItem[];
    activeTab: string;
    setActiveTab: (tabName: string) => void;
    className?: string;
    pagesMode?: boolean;
};

/**
 * General Navigation Menu to be used throughout the app, either through activeTab state or through the URL.
 */
const NavigationMenu: React.FC<NavigationMenuProps> = ({
    items,
    activeTab,
    setActiveTab,
    className,
    pagesMode,
}) => {
    return (
        <div
            className={`flex text-gray-900 z-55 overflow-x-auto ${className ?? ""}`}
            style={{ fontWeight: "600", fontSize: "18px" }}
        >
            {items.map((item, index) => (
                <div
                    key={item.label ?? index}
                    className={`whitespace-nowrap pb-6 hover:text-blue-700 ${
                        activeTab === item.label ? "active-tab" : ""
                    }`}
                    style={{ 
                        color: activeTab === item.label ? "var(--selected-tab-text-color)" : "rgb(17 24 39)",
                    }}
                >
                    {!pagesMode ? (
                        <button
                            className="mx-3 px-5 cursor-pointer"
                            onClick={() => setActiveTab(item.label)}
                        >
                            {item.label}
                        </button>
                    ) : item.link ? (
                        <Link href={item.link} className="mx-3 px-5">
                            {item.label}
                        </Link>
                    ) : (
                        <div className="mx-3 px-5">{item.label}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NavigationMenu;
