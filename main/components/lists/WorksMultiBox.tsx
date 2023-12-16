import { calculateDaysAgo, formatDaysAgo } from "@/utils/functions";
import {
    faArrowLeft,
    faArrowRight,
    faPen,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { GeneralInfo, NavItem, WorkInfo } from "@/types/infoTypes";
import { getObjectNames } from "@/config/getObjectNames";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
const Link = dynamic(() => import("next/link"));
const WorkColorBar = dynamic(
    () => import("@/components/elements/WorksColorBar")
);

export interface MultiWorks {
    experiments: GeneralInfo[];
    datasets: GeneralInfo[];
    dataAnalyses: GeneralInfo[];
    aiModels: GeneralInfo[];
    codeBlocks: GeneralInfo[];
    papers: GeneralInfo[];
}

interface WorksBoxProps {
    works: MultiWorks;
    isEditModeOn?: boolean;
    editModeLink?: string;
}

const WorksMultiBox: React.FC<WorksBoxProps> = ({
    works,
    isEditModeOn,
    editModeLink,
}) => {
    const [activeTab, setActiveTab] = useState<string>();

    let tabs: NavItem[] = [];

    for (const [key, value] of Object.entries(works)) {
        const workTypeInfo = getObjectNames({ camelCase: key });
        if (value && value.length > 0 && workTypeInfo?.plural) {
            tabs.push({
                label: workTypeInfo.plural,
            });
        }
    }

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (tabs && activeTab === undefined) {
            setActiveTab(tabs[0]?.label);
        }
    }, [tabs]);

    const handleNavigation = (work: GeneralInfo) => {
        const workLink = getObjectNames({
            tableName: work.itemType || "",
        })?.linkName;
        router.push(pathname + `/${workLink}/${work.id}`);
    };

    if (tabs.length === 0) return null;

    return (
        <>
            <div
                className="flex items-center w-full justify-between px-2 text-gray-900 font-semibold rounded-t-lg shadow-md border-t border-x border-gray-300"
                style={{ backgroundColor: "var(--page-header-bg-color)" }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        className={`px-4 py-3 flex whitespace-nowrap hover:text-blue-700  ${
                            tab.label === activeTab
                                ? "border-b-2 border-gray-500 text-gray-900"
                                : ""
                        }`}
                        onClick={() => setActiveTab(tab.label)}
                        style={{ fontWeight: "500", fontSize: "18px" }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="rounded-b-lg shadow-lg w-full border border-gray-300 mt-0.5">
                {works && tabs.length && (
                    <>
                        <WorkColorBar
                            percentages={calculateWorkPercentages(works)}
                        />
                        <div
                            className="flex justify-between text-gray-700 text-base py-2 px-4 mt-1 space-x-1 rounded-t-lg"
                            style={{
                                backgroundColor: "var(--page-header-bg-color)",
                            }}
                        >
                            <>{"Title"}</>
                            <div className="flex items-end">{"Created At"}</div>
                        </div>
                        <div className="flex flex-col border-t border-gray-300 overflow-y-auto py-2">
                            {(
                                (works &&
                                    works[
                                        getObjectNames({
                                            plural: activeTab,
                                        })?.camelCase as keyof MultiWorks
                                    ]) ||
                                []
                            )
                                .filter((work, index) => index < 8)
                                .map((work, index) => (
                                    <div
                                        className="flex text-gray-700 py-1 px-2"
                                        key={index}
                                    >
                                        <div
                                            className="flex items-center ml-1"
                                            style={{ fontSize: "18px" }}
                                        >
                                            <FontAwesomeIcon
                                                icon={work.icon || faQuestion}
                                                className="pr-1.5"
                                                style={{
                                                    width: "9px",
                                                    color: work.iconColor || "",
                                                }}
                                            />
                                            <div
                                                className="flex whitespace-nowrap hover:text-blue-600"
                                                style={{
                                                    width: `${Math.min(
                                                        ((work || "").title
                                                            ?.length || 20) *
                                                            20,
                                                        300
                                                    )}px`,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {work.link ? (
                                                    <button
                                                        className="text-ellipsis overflow-hidden"
                                                        onClick={() =>
                                                            handleNavigation(
                                                                work
                                                            )
                                                        }
                                                    >
                                                        {work.title}
                                                    </button>
                                                ) : (
                                                    <div className="text-ellipsis overflow-hidden ">
                                                        {work.title}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm ml-auto">
                                            {formatDaysAgo(
                                                calculateDaysAgo(
                                                    work.createdAt || ""
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {(
                    works[
                        getObjectNames({ plural: activeTab })
                            ?.camelCase as keyof MultiWorks
                    ] || []
                ).length > 8 && (
                    <Link
                        href={`/workspace`}
                        className="w-full flex justify-center p-2 border-t border-gray-300 text-gray-800 hover:text-blue-700 font-semibold"
                    >
                        See All {activeTab}
                    </Link>
                )}
            </div>
        </>
    );
};

export default WorksMultiBox;

export interface WorksPercentages {
    experiments?: number;
    datasets?: number;
    dataAnalyses?: number;
    aiModels?: number;
    codeBlocks?: number;
    papers?: number;
}

export const calculateWorkPercentages = (
    works: MultiWorks
): WorksPercentages => {
    // Calculate the total number of works
    const totalWorks = Object.values(works).reduce(
        (total, workArray) => total + workArray.length,
        0
    );

    // Initialize an empty object to hold the percentages
    const percentages: WorksPercentages = {};

    // Return early if there are no works, to avoid division by zero
    if (totalWorks === 0) {
        return percentages;
    }

    // Calculate the percentage for each category
    for (const [key, workArray] of Object.entries(works) as [
        keyof MultiWorks,
        WorkInfo[]
    ][]) {
        const percentage = (workArray.length / totalWorks) * 100;
        percentages[key] = parseFloat(percentage.toFixed(2)); // Round to two decimal places
    }

    return percentages;
};
