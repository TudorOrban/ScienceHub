import React, { useContext } from "react";
import { Checkbox } from "../../ui/checkbox";
import UsersFilterSelection from "../../search-options/UsersFilterSelection";
import { issuesAvailableSearchOptions } from "@/config/availableSearchOptionsAdvanced";
import SortOptions from "../../search-options/SortOptions";
import StatusFilterOptions from "../../search-options/StatusFilterOptions";
import DateRangeFilterOptions from "../../search-options/DateRangeFilterOptions";
import ProjectsFilterSelection from "@/components/search-options/ProjectsFilterSelection";
import { BrowseIssuesSearchContext } from "@/contexts/search-contexts/browse/BrowseIssuesSearchContext";
import UsersSelection from "../selections/UsersSelection";
import ProjectsSelection from "../selections/ProjectsSelection";

interface IssuesAdvancedSearchOptionsProps {
    className?: string;
    tooltipClassName?: string;
}

const IssuesAdvancedSearchOptions: React.FC<IssuesAdvancedSearchOptionsProps> = (props) => {
    // Context making connection with backend
    const browseIssuesContext = useContext(BrowseIssuesSearchContext);
    if (!browseIssuesContext) {
        throw new Error(
            "BrowseIssuesSearchContext must be used within a BrowseIssuesSearchProvider"
        );
    }
    const { sortOption, setSortOption, descending, setDescending, userSetStates } =
        browseIssuesContext;

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
                availableSortOptions={issuesAvailableSearchOptions.availableSortOptions || []}
            />

            <div className="flex flex-col items-start space-y-4">
                <div className="font-semibold text-lg pt-2 pl-2">Filters:</div>

                {/* By Username/Full Name */}
                <div className="flex items-start mr-2">
                    <Checkbox
                        checked={userFilterOn}
                        onCheckedChange={() => setUserFilterOn(!userFilterOn)}
                        className="mt-0.5"
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

                {/* By Status */}
                <StatusFilterOptions
                    statusFilterOn={statusFilterOn}
                    setStatusFilterOn={setStatusFilterOn}
                    status={status}
                    setStatus={setStatus}
                    availableStatusOptions={
                        issuesAvailableSearchOptions.availableStatusOptions || []
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
                    availableDateOptions={issuesAvailableSearchOptions.availableDateOptions || []}
                />

                <div className="flex items-center justify-between w-full pr-2 py-1">
                    <button
                        className="px-4 py-2 bg-gray-800 text-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-900 text-sm"
                        style={{ fontWeight: 500 }}
                    >
                        Deselect All
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-800 text-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-900 text-sm"
                        style={{ fontWeight: 500 }}
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IssuesAdvancedSearchOptions;
