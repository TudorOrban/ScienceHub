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

const NavigationMenu: React.FC<NavigationMenuProps> = (props) => {
    const handleTabClick = (tabName: string) => {
        props.setActiveTab(tabName);
    };

    return (
        <div
            className={`flex text-gray-900 z-55 overflow-x-auto ${
                props.className || ""
            }`}
            style={{ fontWeight: "500", fontSize: "18px" }}
        >
            {props.items.map((item, index) => (
                <div
                    key={index}
                    className={`mx-3 px-6 pb-6 cursor-pointer whitespace-nowrap ${
                        props.activeTab === item.label
                            ? "text-black border-b border-gray-600"
                            : "text-gray-700"
                    }`}
                >
                    {!props.pagesMode ? (
                        <div
                            className="cursor-pointer"
                            onClick={() => handleTabClick(item.label)}
                        >
                            {item.label}
                        </div>
                    ) : item.link ? (
                        <Link href={item.link}>{item.label}</Link>
                    ) : (
                        <div className="">{item.label}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NavigationMenu;
