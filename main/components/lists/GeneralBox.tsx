import { calculateDaysAgo, formatDaysAgo } from "@/utils/functions";
import dynamic from "next/dynamic";
import { GeneralInfo } from "@/types/infoTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Link = dynamic(() => import("next/link"));

interface GeneralBoxProps {
    title: string; // Box title
    currentItems: GeneralInfo[]; // Box items
    noFooter?: boolean; // No footer
    contentOn?: boolean; // Render items' contents
    createdAtOn?: boolean; // Render created at
    className?: string; // Outer className
    itemClassName?: string; // Item className
    itemsLimit?: number;
}

const GeneralBox: React.FC<GeneralBoxProps> = ({
    title,
    currentItems,
    noFooter,
    contentOn,
    createdAtOn,
    className,
    itemClassName,
    itemsLimit = 8,
}) => {
    const displayedItems = currentItems
        .filter((item, index) => !!item.title)
        .filter((item, index) => index < itemsLimit);

    if (displayedItems.length === 0) {
        return null;
    }

    return (
        <div
            className={`w-full border border-gray-200 rounded-md shadow-md text-gray-700 ${
                className || ""
            }`}
        >
            <div
                className="flex justify-between text-lg py-2 px-4 rounded-t-lg"
                style={{ backgroundColor: "var(--page-header-bg-color)" }}
            >
                <div className="text-gray-900" 
                        style={{ fontWeight: "500", fontSize: "18px" }}>{title}</div>
                {createdAtOn ? (
                    <div className="text-sm mt-1">Created At</div>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex flex-col border-t border-gray-300 overflow-y-auto py-2">
                {currentItems &&
                    Array.isArray(currentItems) &&
                    displayedItems.map((item, index) => (
                        <div
                            key={index}
                            className={`py-1 px-2 ${itemClassName || ""}`}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`${
                                        !contentOn && "w-1/2"
                                    } whitespace-nowrap text-ellipsis overflow-hidden hover:text-blue-600`}
                                    style={{
                                        fontWeight: "500",
                                    }}
                                >
                                    {item.link ? (
                                        <Link
                                            href={item.link}
                                            className="flex items-center text-lg ml-1"
                                            style={{
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.icon && (
                                                <FontAwesomeIcon
                                                    icon={item.icon}
                                                    style={{
                                                        color: item.iconColor,
                                                        width: "10px",
                                                    }}
                                                    className="pr-1.5"
                                                />
                                            )}
                                            {item.title}
                                        </Link>
                                    ) : (
                                        <>{item.title}</>
                                    )}
                                </div>
                                {item.createdAt && (
                                    <div className="text-right text-sm ml-auto">
                                        {formatDaysAgo(
                                            calculateDaysAgo(
                                                item?.createdAt || ""
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                            {item.content && contentOn && <>{item.content}</>}
                        </div>
                    ))}
            </div>
            {(currentItems || []).length > 0 && !noFooter && (
                <Link
                    href={`/workspace`}
                    className="w-full flex justify-center p-2 border-t border-gray-300 text-gray-800 hover:text-blue-700 font-semibold"
                >
                    See All {title}
                </Link>
            )}
        </div>
    );
};

export default GeneralBox;
