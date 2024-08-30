import React, { useContext } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { BrowseWorksSearchContext } from "@/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { worksAvailableSearchOptions } from "@/config/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import MetricComparisonFilterOptions from "../../search-options/MetricComparisonFilterOptions";
import UsersSelection from "../selections/UsersSelection";
import ProjectsSelection from "../selections/ProjectsSelection";

interface WorksAdvancedSearchOptionsProps {
    className?: string;
    tooltipClassName?: string;
}

/**
 * Browse component for advanced search options for works.
 */
const WorksAdvancedSearchOptions: React.FC<WorksAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseWorksContext = useContext(BrowseWorksSearchContext);
    if (!browseWorksContext) {
        throw new Error("BrowseWorksSearchContext must be used within a BrowseWorksSearchProvider");
    }
    const { sortOption, setSortOption, descending, setDescending, userSetStates } =
        browseWorksContext;

    const {
        dateFilterOn,
        userFilterOn,
        projectFilterOn,
        biggerThanFilterOn,
        fieldOfResearchFilterOn,
        users,
        projects,
        startDate,
        endDate,
        selectedDateOption,
        selectedMetric,
        biggerThanMetricValue,
        metricValue,
        fieldOfResearch,
        setUserFilterOn,
        setProjectFilterOn,
        setDateFilterOn,
        setBiggerThanFilterOn,
        setFieldOfResearchFilterOn,
        setUsers,
        setProjects,
        setStartDate,
        setEndDate,
        setSelectedDateOption,
        setSelectedMetric,
        setBiggerThanMetricValue,
        setMetricValue,
        setFieldOfResearch,
    } = userSetStates;

    return (
        <div
            className="w-72 px-4 border-b border-gray-500 overflow-y-auto"
            style={{
                height: "calc(112vh - 8rem)", backgroundColor: "var(--sidebar-bg-color)", color: "var(--sidebar-text-color)"
            }}
        >
            <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
                descending={descending}
                setDescending={setDescending}
                availableSortOptions={worksAvailableSearchOptions.availableSortOptions || []}
            />

            <div className="flex flex-col items-start space-y-4">
                <div className="font-semibold text-lg pt-2 pl-2">Filters:</div>

                {/* By Username/Full Name */}
                <div className="flex items-start mr-2">
                    <Checkbox
                        checked={userFilterOn}
                        onCheckedChange={() => setUserFilterOn(!userFilterOn)}
                        className="mt-0.5 bg-white text-gray-800"
                    />
                    <div className="ml-2">
                        <div className="font-semibold whitespace-nowrap text-sm mb-2">
                            By Main Authors:
                        </div>
                        <UsersSelection
                            selectedUsers={users}
                            setSelectedUsers={setUsers}
                            width={182}
                        />
                    </div>
                </div>

                {/* By Project */}
                <div className="flex items-start mr-2">
                    <Checkbox
                        checked={projectFilterOn}
                        onCheckedChange={() => setProjectFilterOn(!projectFilterOn)}
                        className="mt-0.5"
                    />
                    <div className="ml-2">
                        <div className="font-semibold whitespace-nowrap text-sm mb-2">
                            By Work Projects:
                        </div>
                        <ProjectsSelection
                            selectedProjects={projects}
                            setSelectedProjects={setProjects}
                            width={182}
                        />
                    </div>
                </div>

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
                    availableDateOptions={worksAvailableSearchOptions.availableDateOptions || []}
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
                <div className="flex items-start mr-2">
                    <Checkbox
                        checked={fieldOfResearchFilterOn}
                        onCheckedChange={() => setFieldOfResearchFilterOn(!fieldOfResearchFilterOn)}
                        className="mt-0.5 bg-white text-gray-800"
                    />
                    <div className="w-full ml-2">
                        <div className="font-semibold whitespace-nowrap text-sm mb-2">
                            By Field of Research:
                        </div>
                        <Select
                            value={fieldOfResearch}
                            onValueChange={(newFieldOfResearch: string) =>
                                setFieldOfResearch(newFieldOfResearch)
                            }
                        >
                            <SelectTrigger className="flex w-56 whitespace-nowrap text-gray-800 font-semibold pl-2 pr-2">
                                <SelectValue placeholder={"Select field of research"}>
                                    {
                                        worksAvailableSearchOptions.availableFieldsOfResearch?.find(
                                            (option) => option.value === fieldOfResearch
                                        )?.label
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <div className="font-semibold text-gray-800 text-base p-1">
                                    Select Field Of Research
                                </div>
                                {worksAvailableSearchOptions.availableFieldsOfResearch?.map(
                                    (option, index) => (
                                        <SelectItem key={index} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full pr-1 py-1">
                    <button
                        className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm hover:bg-gray-400 text-sm font-semibold"
                    >
                        Deselect All
                    </button>
                    <button
                        className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm hover:bg-gray-400 text-sm font-semibold"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorksAdvancedSearchOptions;
