import { NavItem } from "@/types/infoTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type NavigationMenuProps = {
    items: NavItem[];
    activeTab: string;
    setActiveTab: (tabName: string) => void;
    className?: string;
    pagesMode?: boolean;
};

const NavigationMenu: React.FC<NavigationMenuProps> = ({
    items,
    activeTab,
    setActiveTab,
    className,
    pagesMode,
}) => {
    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div
            className={`flex text-gray-900 z-55 overflow-x-auto ${
                className || ""
            }`}
            style={{ fontWeight: "600", fontSize: "18px" }}
        >
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`whitespace-nowrap pb-6 hover:text-black ${
                        activeTab === item.label
                            ? "text-black active-tab"
                            : "text-gray-700"
                    }`}
                >
                    {!pagesMode ? (
                        <div
                            className="mx-3 px-6 cursor-pointer"
                            onClick={() => handleTabClick(item.label)}
                        >
                            {item.label}
                        </div>
                    ) : item.link ? (
                        <Link href={item.link} className="mx-3 px-6">{item.label}</Link>
                    ) : (
                        <div className="mx-3 px-6">{item.label}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NavigationMenu;
