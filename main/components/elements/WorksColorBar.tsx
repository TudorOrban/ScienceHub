import { getObjectNames } from "@/utils/getObjectNames";
import { WorksPercentages } from "../lists/WorksMultiBox";
import { workTypeIconMap } from "./SmallWorkCard";

interface WorkColorBarProps {
    percentages: WorksPercentages;
  }

const WorkColorBar: React.FC<WorkColorBarProps> = ({ percentages }) => {
    const allZero = Object.entries(percentages).every(([key, value]) => value === 0);

    return (
        <div className="flex h-4">
            {allZero ? (
                <div className="bg-gray-300 h-full w-full"></div>
            ) : (
                Object.entries(percentages).map(([key, value]) => (
                    value > 0 ? (
                        <div
                            key={key}
                            className={`h-full`}
                            style={{ width: `${value}%`, backgroundColor: workTypeIconMap(getObjectNames({ camelCase: key})?.label || "").color }}
                        ></div>
                    ) : null
                ))
            )}
        </div>
    );
};

export default WorkColorBar;
