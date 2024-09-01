import { getObjectNames } from "@/src/config/getObjectNames";
import { WorksPercentages } from "../lists/WorksMultiBox";
import { workTypeIconMap } from "../cards/small-cards/SmallWorkCard";

interface WorkColorBarProps {
    percentages: WorksPercentages;
}

/**
 * Bar displaying percentages of work types
 */
const WorkColorBar: React.FC<WorkColorBarProps> = ({ percentages }) => {
    const allZero = Object.entries(percentages).every(([key, value]) => value === 0);

    return (
        <div className="flex h-2 shadow-sm">
            {allZero ? (
                <div className="bg-gray-300 h-full w-full"></div>
            ) : (
                Object.entries(percentages).map(([key, value]) =>
                    value > 0 ? (
                        <div
                            key={key}
                            className={`h-full`}
                            style={{
                                width: `${value}%`,
                                backgroundColor: workTypeIconMap(
                                    getObjectNames({ camelCase: key })?.label || ""
                                ).color,
                            }}
                        ></div>
                    ) : null
                )
            )}
        </div>
    );
};

export default WorkColorBar;
