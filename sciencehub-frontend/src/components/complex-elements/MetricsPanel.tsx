import { Feature } from "@/src/types/infoTypes";
import {
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Skeleton } from "../ui/skeleton";

interface MetricsPanelProps {
    researchMetrics?: Feature[];
    communityMetrics?: Feature[];
    isLoading?: boolean;
}

/**
 * Component for displaying a Project/Work's metrics.
 */
const MetricsPanel: React.FC<MetricsPanelProps> = ({
    researchMetrics,
    communityMetrics,
    isLoading,
}) => {
    return (
        <div className="grid grid-cols-[auto,auto] gap-y-2 pl-4 pr-8 py-2 border border-gray-200 rounded-lg shadow-md bg-white ">
            {/* First row */}
            <div className="font-semibold whitespace-nowrap">
                <div className="text-gray-900 text-lg mb-1">
                    Research metrics:
                </div>
                {researchMetrics?.map((metric, index) => (
                    <div key={index} className="flex items-center py-1.5">
                        <FontAwesomeIcon
                            icon={metric.icon || faQuestion}
                            className="small-icon mr-1 text-gray-700"
                        />
                        <div className="text-gray-800 ">
                            {metric.label || ""}:{" "}
                        </div>
                        <span className="pl-1 text-gray-700" style={{ fontWeight: 500 }}>
                            {!isLoading ? (
                                metric.value || 0
                            ) : (
                                <Skeleton className="w-8 h-6 bg-gray-400 ml-2" />
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* Second row */}
            <div className="font-semibold whitespace-nowrap ml-0 lg:ml-16 hidden lg:block">
                <div
                    className="text-gray-900 text-lg mb-1"
                >
                    Community metrics:
                </div>
                {communityMetrics?.map((metric, index) => (
                    <div key={index} className="flex items-center py-1.5">
                        <FontAwesomeIcon
                            icon={metric.icon || faQuestion}
                            className="small-icon mr-1"
                        />
                        <div className="text-gray-800 ">
                            {metric.label || ""}:{" "}
                        </div>
                        <span className="font-normal pl-1 text-gray-700" style={{ fontWeight: 500 }}>
                            {!isLoading ? (
                                metric.value || 0
                            ) : (
                                <Skeleton className="w-8 h-6 bg-gray-400 ml-2" />
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MetricsPanel;
