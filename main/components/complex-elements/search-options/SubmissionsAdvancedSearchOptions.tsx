import React, { useContext } from "react";
import { Checkbox } from "../../ui/checkbox";
import UsersFilterSelection from "../../search-options/UsersFilterSelection";
import { submissionsAvailableSearchOptions } from "@/config/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import StatusFilterOptions from "../../search-options/StatusFilterOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import ProjectsFilterSelection from "@/components/search-options/ProjectsFilterSelection";
import { BrowseSubmissionsSearchContext } from "@/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";

interface ReviewsAdvancedSearchOptionsProps {
    className?: string;
    tooltipClassName?: string;
};

const SubmissionsAdvancedSearchOptions: React.FC<ReviewsAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseSubmissionsContext = useContext(BrowseSubmissionsSearchContext);
    if (!browseSubmissionsContext) {
        throw new Error(
            "BrowseSubmissionsSearchContext must be used within a BrowseSubmissionsSearchProvider"
        );
    }
    const {
        sortOption,
        setSortOption,
        descending,
        setDescending,
        userSetStates,
    } = browseSubmissionsContext;

    const {
        dateFilterOn,
        userFilterOn,
        projectFilterOn,
        statusFilterOn,
        status,
        startDate,
        endDate,
        selectedDateOption,
        setDateFilterOn,
        setUserFilterOn,
        setProjectFilterOn,
        setStatusFilterOn,
        setStatus,
        setStartDate,
        setEndDate,
        setSelectedDateOption,
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
                    submissionsAvailableSearchOptions.availableSortOptions || []
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
                <div className="pt-1 pl-6">
                    <UsersFilterSelection
                        context={"Browse Submissions"}
                        browseMode={true}
                    />
                </div>
            </div>


            {/* By Project */}
            <div className="pt-2 mr-2">
                <div className="flex items-center pr-2">
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
                        context={"Browse Submissions"}
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
                    submissionsAvailableSearchOptions.availableStatusOptions || []
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
                    submissionsAvailableSearchOptions.availableDateOptions || []
                }
            />

            {/* Add more filters here */}
            {/* </div> */}
        </div>
    );
};

export default SubmissionsAdvancedSearchOptions;