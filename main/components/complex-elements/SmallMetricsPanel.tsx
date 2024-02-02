import { faBookJournalWhills, faClipboardCheck, faTableList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "../ui/skeleton";

interface SmallMetricsPanelProps {
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    isLoading?: boolean;
}

/**
 * Component for displaying a Project/Work's metrics, small version.
 */
const SmallMetricsPanel: React.FC<SmallMetricsPanelProps> = ({
    researchScore,
    hIndex,
    citationsCount,
    isLoading,
}) => {
    if (isLoading) {
        return <Skeleton className="w-80 h-6 bg-gray-400 ml-2" />;
    }

    return (
        <>
            <div
                className="flex flex-col lg:flex-row items-center px-2 lg:space-x-2 bg-white border border-gray-300 shadow-sm rounded-md whitespace-nowrap text-base"
                style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.35rem",
                }}
            >
                <div className="flex items-center p-1.5">
                    <FontAwesomeIcon
                        icon={faBookJournalWhills}
                        className="mr-1 text-gray-700"
                        style={{ width: "11px" }}
                    />
                    <span className="font-semibold mr-1">Research Score: </span>
                    {researchScore || 0}
                </div>
                <div className="flex items-center p-1.5">
                    <FontAwesomeIcon
                        icon={faTableList}
                        className="mr-2 text-gray-700"
                        style={{ width: "13px" }}
                    />

                    <span className="font-semibold mr-1">h-Index:</span>
                    {hIndex || 0}
                </div>
                <div className="flex items-center p-1.5">
                    <FontAwesomeIcon
                        icon={faClipboardCheck}
                        className="mr-1 text-gray-700"
                        style={{ width: "11px" }}
                    />
                    <span className="font-semibold mr-1">Citations: </span>
                    {citationsCount || 0}
                </div>
            </div>
        </>
    );
};

export default SmallMetricsPanel;