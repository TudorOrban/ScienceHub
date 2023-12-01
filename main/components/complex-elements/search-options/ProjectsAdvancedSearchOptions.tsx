import React, { useContext } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { BrowseProjectsSearchContext } from "@/app/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import UsersFilterSelection from "../../search-options/UsersFilterSelection";
import { projectsAvailableSearchOptions } from "@/utils/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import StatusFilterOptions from "../../search-options/StatusFilterOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import MetricComparisonFilterOptions from "../../search-options/MetricComparisonFilterOptions";

type ProjectsAdvancedSearchOptionsProps = {
    className?: string;
    tooltipClassName?: string;
};

const ProjectsAdvancedSearchOptions: React.FC<ProjectsAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseProjectsContext = useContext(BrowseProjectsSearchContext);
    if (!browseProjectsContext) {
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
    } = browseProjectsContext;

    const {
        dateFilterOn,
        userFilterOn,
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
            className="w-72 px-4 bg-gray-100 border border-gray-300 overflow-y-auto overflow-x-none"
            style={{ height: "calc(100vh - 8rem)" }}
        >
            <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
                descending={descending}
                setDescending={setDescending}
                availableSortOptions={
                    projectsAvailableSearchOptions.availableSortOptions || []
                }
            />

            <div className="flex flex-col items-start">
                <div className="font-semibold text-lg py-2 pl-2">Filters:</div>

                {/* By Username/Full Name */}
                <div className="flex items-start mr-2">
                    <div className="pt-2 pr-2">
                        <Checkbox
                            checked={userFilterOn}
                            onCheckedChange={() =>
                                setUserFilterOn(!userFilterOn)
                            }
                        />
                    </div>
                    <UsersFilterSelection context={"Browse Projects"} browseMode={true} />
                </div>

                {/* By Status */}
                <StatusFilterOptions
                    statusFilterOn={statusFilterOn}
                    setStatusFilterOn={setStatusFilterOn}
                    status={status}
                    setStatus={setStatus}
                    availableStatusOptions={
                        projectsAvailableSearchOptions.availableStatusOptions || []
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
                        projectsAvailableSearchOptions.availableDateOptions || []
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
                        projectsAvailableSearchOptions.availableMetricOptions || []
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
                                {projectsAvailableSearchOptions?.availableMetricOptions?.map(
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
                {/* Add more filters here */}
            </div>
        </div>
    );
};

export default ProjectsAdvancedSearchOptions;

/*
Projects Search:

Sort options: ascending/descending +:
-by created at date
-by name
-by research score/h-index/number of citations (research metrics)
-by views, upvotes, shares (community metrics) 

Filter options:
-by username/full name: Tudor Orban
-by created at/updated at: [2021-07-23, 2022-08-12]
-by metrics: > or < some value
-by status: ongoing, completed..
-other

-field of research - complex options based on a graph representation of scientific fields; for instance, when choosing climate science,
user has option to include through this all its parents (eg chemistry) or not
*/

{
    /* <div className="flex items-center whitespace-nowrap p-2 border-y border-gray-300">
                <button
                    onClick={() => scrollContainer("left")}
                    className="px-3"
                >
                    <FontAwesomeIcon icon={faCaretLeft} />
                </button>
                <div
                    ref={scrollContainerRef}
                    id="scroll-container"
                    className="flex overflow-x-auto"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        overflowY: "hidden",
                    }}
                >
                    <RadioGroup defaultValue={"By date"} className="flex">
                        {availableSortOptions.map((sortOption, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 whitespace-nowrap bg-white h-10 rounded-md pl-2"
                            >
                                <RadioGroupItem
                                    value={sortOption.value}
                                    id={sortOption.label}
                                    className="border-gray-700"
                                    style={{
                                        paddingBottom: "1px",
                                        paddingRight: "1px",
                                    }}
                                />
                                <Label
                                    htmlFor={sortOption.label}
                                    className="pr-2"
                                >
                                    {sortOption.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <button
                    onClick={() => scrollContainer("right")}
                    className="pl-4 pr-2"
                >
                    <FontAwesomeIcon
                        icon={faCaretRight}
                        className="small-icon"
                    />
                </button>
                {descending ? (
                    <Button
                        variant="default"
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800"
                        onClick={toggleSortDirection}
                    >
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            className="small-icon"
                        />
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800"
                        onClick={toggleSortDirection}
                    >
                        <FontAwesomeIcon
                            icon={faArrowDown}
                            className="small-icon"
                        />
                    </Button>
                )}
            </div> */
}

{
    /* <div className="flex font-semibold text-lg pl-2 pt-2">
                Sort Options:
            </div>
            <div className="flex items-center border-b border-gray-300 py-2 pr-2">
                <Select
                    value={sortOption}
                    onValueChange={(option: string) => {
                        setSortOption(option);
                    }}
                >
                    <SelectTrigger className="flex whitespace-nowrap text-gray-800 font-semibold pl-2 pr-2">
                        <SelectValue>
                            <SelectValue>
                                {
                                    worksAvailableSearchOptions?.availableSortOptions?.find(
                                        (option) => option.value === sortOption
                                    )?.label
                                }
                            </SelectValue>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {worksAvailableSearchOptions?.availableSortOptions?.map(
                            (option, index) => (
                                <SelectItem
                                    key={index}
                                    value={option.value} // required by the component
                                    // onClick={() => {
                                    //     setSortOption(option.value); // setting the sortOption from context
                                    //     // Optionally, set 'descending' here as well
                                    // }}
                                >
                                    {option.label}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
                {descending ? (
                    <Button
                        variant="default"
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 w-9 h-9"
                        onClick={() => setDescending(!descending)}
                    >
                        <FontAwesomeIcon
                            icon={faArrowUpWideShort}
                            className="small-icon"
                        />
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 w-9 h-9"
                        onClick={() => setDescending(!descending)}
                    >
                        <FontAwesomeIcon
                            icon={faArrowDownShortWide}
                            className="small-icon"
                        />
                    </Button>
                )}
            </div> */
}
