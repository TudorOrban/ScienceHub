import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { faCircleChevronRight, faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";
import { Input } from "../ui/input";
import { SearchOption } from "@/src/types/searchTypes";

type MetricComparisonFilterOptionsProps = {
    biggerThanFilterOn: boolean;
    setBiggerThanFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMetric: string;
    setSelectedMetric: React.Dispatch<React.SetStateAction<string>>;
    biggerThanMetricValue: boolean;
    setBiggerThanMetricValue: React.Dispatch<React.SetStateAction<boolean>>;
    metricValue: number;
    setMetricValue: React.Dispatch<React.SetStateAction<number>>;
    availableMetricOptions: SearchOption[];
};

/**
 * Metric comparison filter for the Browse pages.
 */
const MetricComparisonFilterOptions: React.FC<MetricComparisonFilterOptionsProps> = ({
    biggerThanFilterOn,
    setBiggerThanFilterOn,
    selectedMetric,
    setSelectedMetric,
    biggerThanMetricValue,
    setBiggerThanMetricValue,
    metricValue,
    setMetricValue,
    availableMetricOptions,
}) => {
    const [tempMetricValue, setTempMetricValue] = useState<string>("0");

    const toggleBiggerThan = () => {
        setBiggerThanMetricValue(!biggerThanMetricValue);
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <Checkbox
                    checked={biggerThanFilterOn}
                    onCheckedChange={() => setBiggerThanFilterOn(!biggerThanFilterOn)}
                        className="mt-0.5 bg-white text-gray-800"
                />
                <div className="pl-2 w-[231px]">
                    <Select
                        value={selectedMetric}
                        onValueChange={(newMetric: string) => setSelectedMetric(newMetric)}
                    >
                        <SelectTrigger className="flex whitespace-nowrap text-gray-800 font-semibold pl-2 pr-2 rounded-none rounded-t-md">
                            <SelectValue>
                                {
                                    availableMetricOptions?.find(
                                        (option) => option.value === selectedMetric
                                    )?.label
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <div className="font-semibold text-gray-800 text-base p-1">
                                Select Metric
                            </div>
                            {availableMetricOptions?.map((option, index) => (
                                <SelectItem key={index} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center pl-6 pr-2">
                {biggerThanMetricValue ? (
                    <button
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 rounded-bl-md w-9 h-9 px-1"
                        onClick={toggleBiggerThan}
                    >
                        <FontAwesomeIcon icon={faGreaterThan} style={{ width: "8px" }} />
                    </button>
                ) : (
                    <button
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 w-9 h-9 rounded-bl-md px-1"
                        onClick={toggleBiggerThan}
                    >
                        <FontAwesomeIcon icon={faLessThan} style={{ width: "8px" }} />
                    </button>
                )}
                <Input
                    type="text"
                    id="metricValue"
                    value={tempMetricValue}
                    onChange={(e) => setTempMetricValue(e.target.value)}
                    className="bg-white text-gray-800 h-9 py-1 rounded-none focus:outline-none"
                    placeholder={`0`}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setMetricValue(Number(tempMetricValue));
                        }
                    }}
                />
                <button
                    className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 w-9 h-9 rounded-br-md px-1"
                    onClick={() => setMetricValue(Number(tempMetricValue))}
                >
                    <FontAwesomeIcon
                        icon={faCircleChevronRight}
                        className="small-icon text-gray-700"
                    />
                </button>
            </div>
        </div>
    );
};

export default MetricComparisonFilterOptions;
