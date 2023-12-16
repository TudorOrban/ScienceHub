import React, { useContext } from "react";
import { Checkbox } from "../../ui/checkbox";
import UsersFilterSelection from "../../search-options/UsersFilterSelection";
import { reviewsAvailableSearchOptions } from "@/config/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import StatusFilterOptions from "../../search-options/StatusFilterOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import ProjectsFilterSelection from "@/components/search-options/ProjectsFilterSelection";
import { BrowseReviewsSearchContext } from "@/contexts/search-contexts/browse/BrowseReviewsSearchContext";

interface ReviewsAdvancedSearchOptionsProps {
    className?: string;
    tooltipClassName?: string;
};

const ReviewsAdvancedSearchOptions: React.FC<ReviewsAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseReviewsContext = useContext(BrowseReviewsSearchContext);
    if (!browseReviewsContext) {
        throw new Error(
            "BrowseReviewsSearchContext must be used within a BrowseReviewsSearchProvider"
        );
    }
    const {
        sortOption,
        setSortOption,
        descending,
        setDescending,
        userSetStates,
    } = browseReviewsContext;

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
                    reviewsAvailableSearchOptions.availableSortOptions || []
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
                        context={"Browse Reviews"}
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
                        context={"Browse Reviews"}
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
                    reviewsAvailableSearchOptions.availableStatusOptions || []
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
                    reviewsAvailableSearchOptions.availableDateOptions || []
                }
            />

            {/* </div> */}
        </div>
    );
};

export default ReviewsAdvancedSearchOptions;