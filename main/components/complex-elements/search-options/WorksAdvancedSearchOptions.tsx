import React, { useContext } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { BrowseWorksSearchContext } from "@/contexts/search-contexts/browse/BrowseWorksSearchContext";
import UsersFilterSelection from "../../search-options/UsersFilterSelection";
import { worksAvailableSearchOptions } from "@/utils/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import StatusFilterOptions from "../../search-options/StatusFilterOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import MetricComparisonFilterOptions from "../../search-options/MetricComparisonFilterOptions";
import ProjectsFilterSelection from "@/components/search-options/ProjectsFilterSelection";

interface WorksAdvancedSearchOptionsProps {
    className?: string;
    tooltipClassName?: string;
};

const WorksAdvancedSearchOptions: React.FC<WorksAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseWorksContext = useContext(BrowseWorksSearchContext);
    if (!browseWorksContext) {
        throw new Error(
            "BrowseWorksSearchContext must be used within a BrowseWorksSearchProvider"
        );
    }
    const {
        sortOption,
        setSortOption,
        descending,
        setDescending,
        userSetStates,
    } = browseWorksContext;

    const {
        dateFilterOn,
        userFilterOn,
        projectFilterOn,
        statusFilterOn,
        biggerThanFilterOn,
        status,
        startDate,
        endDate,
        selectedDateOption,
        selectedMetric,
        biggerThanMetricValue,
        metricValue,
        setDateFilterOn,
        setUserFilterOn,
        setProjectFilterOn,
        setStatusFilterOn,
        setBiggerThanFilterOn,
        setStatus,
        setStartDate,
        setEndDate,
        setSelectedDateOption,
        setSelectedMetric,
        setBiggerThanMetricValue,
        setMetricValue,
    } = userSetStates;

    return (
        <div
            className="w-72 px-4 bg-gray-100 border border-gray-300 overflow-y-auto"
            style={{
                height: "calc(120vh - 8rem)",
            }}
        >
            <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
                descending={descending}
                setDescending={setDescending}
                availableSortOptions={
                    worksAvailableSearchOptions.availableSortOptions || []
                }
            />

            {/* <div className=""> */}
            <div className="font-semibold text-lg pt-2 pl-2">Filters:</div>

            {/* By Username/Full Name */}
            <div className="mr-2">
                <div className="flex items-center pt-2 pr-2">
                    <Checkbox
                        checked={userFilterOn}
                        onCheckedChange={() => setUserFilterOn(!userFilterOn)}
                    />
                    <div className="font-semibold text-sm pl-2">By User:</div>
                </div>
                <div className="pl-6">
                    <UsersFilterSelection
                        context={"Browse Works"}
                        browseMode={true}
                    />
                </div>
            </div>

            {/* By Project */}
            <div className="mr-2 mb-0 pb-0">
                <div className="flex items-center pt-2 pr-2">
                    <Checkbox
                        checked={projectFilterOn}
                        onCheckedChange={() =>
                            setProjectFilterOn(!projectFilterOn)
                        }
                    />
                    <div className="font-semibold text-sm pl-2">
                        By Project:
                    </div>
                </div>
                <div className="pl-6">
                    <ProjectsFilterSelection
                        context={"Browse Works"}
                    />
                </div>
            </div>

            {/* By Status */}
            <StatusFilterOptions
                statusFilterOn={statusFilterOn}
                setStatusFilterOn={setStatusFilterOn}
                status={status}
                setStatus={setStatus}
                availableStatusOptions={
                    worksAvailableSearchOptions.availableStatusOptions || []
                }
            />

            {/* By Created At/Updated At */}
            <DateRangeFilterOptions
                dateFilterOn={dateFilterOn}
                setDateFilterOn={setDateFilterOn}
                selectedDateOption={selectedDateOption}
                setSelectedDateOption={setSelectedDateOption}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                availableDateOptions={
                    worksAvailableSearchOptions.availableDateOptions || []
                }
            />

            {/* Metric comparison filter */}
            <MetricComparisonFilterOptions
                biggerThanFilterOn={biggerThanFilterOn}
                setBiggerThanFilterOn={setBiggerThanFilterOn}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                biggerThanMetricValue={biggerThanMetricValue}
                setBiggerThanMetricValue={setBiggerThanMetricValue}
                metricValue={metricValue}
                setMetricValue={setMetricValue}
                availableMetricOptions={
                    worksAvailableSearchOptions.availableMetricOptions || []
                }
            />

            {/* Field of Research*/}
            <div className="pt-2">
                <div className="flex items-center pb-2">
                    <Checkbox />
                    <div className="pl-2 font-semibold text-sm">
                        By Field of Research:
                    </div>
                </div>
                <div className="flex items-center pl-6">
                    <Select onValueChange={() => {}} value={selectedMetric}>
                        <SelectTrigger className="w-[200px] flex whitespace-nowrap text-gray-800 font-semibold pl-2 pr-2">
                            <SelectValue>{selectedMetric}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {worksAvailableSearchOptions?.availableMetricOptions?.map(
                                (option, index) => (
                                    <SelectItem
                                        key={index}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default WorksAdvancedSearchOptions;
