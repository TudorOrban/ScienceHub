import React, { useContext } from "react";
import { Checkbox } from "../../ui/checkbox";
import { submissionsAvailableSearchOptions } from "@/src/config/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import StatusFilterOptions from "../../search-options/StatusFilterOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import { BrowseSubmissionsSearchContext } from "@/src/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import UsersSelection from "../selections/UsersSelection";
import ProjectsSelection from "../selections/ProjectsSelection";

interface ReviewsAdvancedSearchOptionsProps {
    className?: string;
    tooltipClassName?: string;
}

/**
 * Browse component for advanced search options for submissions.
 */
const SubmissionsAdvancedSearchOptions: React.FC<ReviewsAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseSubmissionsContext = useContext(BrowseSubmissionsSearchContext);
    if (!browseSubmissionsContext) {
        throw new Error(
            "BrowseSubmissionsSearchContext must be used within a BrowseSubmissionsSearchProvider"
        );
    }
    const { sortOption, setSortOption, descending, setDescending, userSetStates } =
        browseSubmissionsContext;

    const {
        dateFilterOn,
        userFilterOn,
        projectFilterOn,
        statusFilterOn,
        users,
        projects,
        status,
        startDate,
        endDate,
        selectedDateOption,
        setDateFilterOn,
        setUserFilterOn,
        setProjectFilterOn,
        setStatusFilterOn,
        setUsers,
        setProjects,
        setStatus,
        setStartDate,
        setEndDate,
        setSelectedDateOption,
    } = userSetStates;

    return (
        <div
            className="w-72 px-4 border-t border-gray-500 overflow-y-auto"
            style={{
                height: "calc(104vh - 8rem)", backgroundColor: "var(--sidebar-bg-color)", color: "var(--sidebar-text-color)"
            }}
        >
            <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
                descending={descending}
                setDescending={setDescending}
                availableSortOptions={submissionsAvailableSearchOptions.availableSortOptions || []}
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
                            By Authors:
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
                        className="mt-0.5 bg-white text-gray-800"
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

                <div className="flex items-center justify-between w-full pr-2 py-1">
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

export default SubmissionsAdvancedSearchOptions;
