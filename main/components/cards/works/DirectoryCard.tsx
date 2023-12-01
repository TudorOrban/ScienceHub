import { calculateDaysAgo } from "@/utils/functions";
import {
    Experiment,
    Folder,
    File,
    Dataset,
    DataAnalysis,
    AIModel,
    CodeBlock,
    Paper,
} from "@/types/workTypes";
import {
    IconDefinition,
    faCaretDown,
    faChartSimple,
    faClipboard,
    faCode,
    faDatabase,
    faFlask,
    faFolder,
    faMicrochip,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ProjectLayout } from "@/types/projectTypes";

type Item =
    | Folder
    | File
    | Experiment
    | Dataset
    | DataAnalysis
    | AIModel
    | CodeBlock
    | Paper;

interface RenderItemProps {
    item: Item;
    allItems: Item[];
    level: number;
    isLastChild: boolean;
}

const RenderItem: React.FC<RenderItemProps> = ({
    item,
    allItems,
    level = 0,
    isLastChild,
}) => {
    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

    const children = allItems.filter(
        (childItem) => "parentId" in childItem && childItem.parentId === item.id
    );

    const horizontalLinePosition =
        children.length > 0 ? `${50 / (children.length + 1) + 25}%` : "50%";

    // Generate display name by removing parent folder name if necessary
    let displayName = "";
    if ("name" in item) {
        displayName = item.name || "";
    } else if ("title" in item) {
        displayName = item.title || "";
    }
    if ("parentId" in item && item.parentId) {
        const parent = allItems.find(
            (parentItem) => parentItem.id === item.parentId
        );
        if (parent && "name" in parent) {
            displayName = displayName.replace(`${parent.name} `, "");
        }
    }
    const { icon, color } = getItemIconAndColor(item);

    const toggleExpand = (itemId: string) => {
        if (expandedItems.includes(itemId)) {
            setExpandedItems(expandedItems.filter((id) => id !== itemId));
        } else {
            setExpandedItems([...expandedItems, itemId]);
        }
    };

    const numberId = item.id.toString();

    const isExpanded = "id" in item && expandedItems.includes(numberId);

    return (
        <div style={{ position: "relative" }}>
            <div
                className="flex justify-between p-3 rounded w-full border border-gray-100"
                style={{ paddingLeft: `${12 + level * 30}px` }}
            >
                <div className="flex items-center">
                    {level > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "25px",
                                left: `${(level - 1) * 30 + 20}px`,
                                width: "10px",
                                height: "1px",
                                backgroundColor: "#9E9E9E",
                            }}
                        />
                    )}
                    {icon && (
                        <FontAwesomeIcon
                            icon={icon}
                            style={{ color }}
                            className="small-icon mr-2"
                        />
                    )}
                    <span
                        onClick={() => "id" in item && toggleExpand(numberId)}
                    >
                        {displayName}
                    </span>
                    {"contents" in item && (
                        <>
                            {children.length > 0 ? (
                                <FontAwesomeIcon
                                    icon={faCaretDown}
                                    className={`small-icon ml-2 ${
                                        isExpanded ? "rotated" : ""
                                    }`}
                                    onClick={() =>
                                        "id" in item && toggleExpand(numberId)
                                    }
                                />
                            ) : null}
                        </>
                    )}
                </div>
                <div className="text-right text-sm text-gray-500">
                    {calculateDaysAgo(item.createdAt || "")} days ago
                </div>
            </div>

            {/* Vertical Line */}
            {level > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        bottom: isLastChild ? "49%" : "0",
                        left: `${(level - 1) * 30 + 20}px`,
                        width: "1px",
                        backgroundColor: "#AFAFAF",
                    }}
                />
            )}

            {/* Render children */}
            {isExpanded && children.length > 0 && (
                <div className="">
                    {/* Horizontal Line */}
                    {children.map((child, index) => (
                        <RenderItem
                            key={index}
                            item={child}
                            allItems={allItems}
                            level={level + 1}
                            isLastChild={index === children.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const DirectoryUI: React.FC<{ projectData: ProjectLayout }> = ({
    projectData,
}) => {
    const allItems = [
        ...(projectData.folders || []),
        ...(projectData.files || []),
        ...(projectData.experiments || []),
        ...(projectData.datasets || []),
        ...(projectData.dataAnalyses || []),
        ...(projectData.aiModels || []),
        ...(projectData.codeBlocks || []),
        ...(projectData.papers || []),
    ];

    const rootItems = allItems.filter(
        (item) => !("parentId" in item && item.parentId)
    );

    const isLastChild = (item: Item, allItems: Item[]) => {
        if ("parentId" in item && item.parentId) {
            const siblings = allItems.filter(
                (sibling) =>
                    "parentId" in sibling && sibling.parentId === item.parentId
            );
            return siblings[siblings.length - 1].id === item.id;
        }
        return false;
    };

    return (
        <div className="mx-4 border border-gray-200 rounded-md">
            {/* Directory Header */}
            <div className="flex justify-between p-3 bg-gray-100 ">
                <div className="text-left text-sm font-semibold">Name</div>
                <div className="text-right text-sm font-semibold">
                    Last Commit
                </div>
                <div className="text-right text-sm font-semibold">Time</div>
            </div>

            {/* Directory Items */}
            {rootItems.map((item, index) => (
                <RenderItem
                    key={index}
                    item={item}
                    allItems={allItems}
                    level={0}
                    isLastChild={isLastChild(item, allItems)}
                />
            ))}
        </div>
    );
};

export default DirectoryUI;

type IconAndColor = {
    icon: IconDefinition;
    color: string;
};

// TODO: Replace this ***
const getItemIconAndColor = (item: Item): IconAndColor => {
    switch (true) {
        case "id" in item && "parentId" in item:
            return { icon: faFolder, color: "#5D5D5D" };

        case "methodology" in item:
            return { icon: faFlask, color: "#2E3A87" };

        case "datasetPath" in item:
            return { icon: faDatabase, color: "#1A8E34" };

        case "notebookPath" in item:
            return { icon: faChartSimple, color: "#8B2DAE" };

        case "modelPath" in item:
            return { icon: faMicrochip, color: "#DAA520" };

        case "code" in item:
            return { icon: faCode, color: "#C82333" };

        case "pdfPath" in item:
            return { icon: faClipboard, color: "#4A4A4A" };

        default:
            return { icon: faQuestion, color: "#000000" };
    }
};
