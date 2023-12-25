import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
    faPlus,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/complex-elements/SearchInput";
import NavigationMenu from "./NavigationMenu";
import Breadcrumb from "../elements/Breadcrumb";
import { NavItem } from "@/types/infoTypes";
import { useSearchContext } from "@/hooks/fetch/search-hooks/useSearchContext";

interface CommonUIProps {
    breadcrumb?: boolean;
    title?: string;
    users?: string[];
    searchBarPlaceholder?: string;
    sortOptions?: string[];
    filterOptions?: string[];
    onCreateNew?: () => void;
    navigationMenuItems?: NavItem[];
    editMode?: boolean;
    projectId?: number;
    searchContext?: string;
    className?: string;
}

const ListHeaderUI: React.FC<CommonUIProps> = ({
    breadcrumb,
    title,
    users,
    searchBarPlaceholder,
    sortOptions,
    filterOptions,
    onCreateNew,
    navigationMenuItems,
    searchContext = "Workspace General",
    className,
}) => {
    const [activeTab, setActiveTab] = useState<string>("");

    const context = useSearchContext(searchContext);

    if (!context) {
        throw new Error("ListHeaderUI must be used within a SearchProvider");
    }

    const { filters, setFilters, sortOption, setSortOption, descending, setDescending } = context;

    const availableSortOptions = [
        { label: "By Last Modified", value: "updated_at" },
        { label: "By Created at", value: "created_at" },
        { label: "By Name", value: "name" },
    ];
    const availableFilterOptions = [
        { label: "Recently Created", value: "created_at_desc" },
        { label: "Name Ascending", value: "name_asc" },
    ];

    const handleSortChange = (value: string | React.ChangeEvent<HTMLSelectElement>) => {
        let newSortOption = "";
        if (typeof value === "string") {
            newSortOption = value;
        } else {
            newSortOption = value.target.value;
        }
        setSortOption(newSortOption);
    };

    return (
        <div className={`container mx-auto px-0 py-4 w-full ${className}`}>
            {/* Breadcrumb and Title */}
            {breadcrumb && (
                <div className="ml-8">
                    <Breadcrumb />
                </div>
            )}
            {title && <h2 className="text-3xl font-bold text-primary mb-4 mt-5 ml-8">{title}</h2>}
            {users && (
                <div className="flex text-gray-600">
                    <FontAwesomeIcon
                        className="small-icon text-blue-600"
                        icon={faUser}
                        style={{
                            marginLeft: "0.2em",
                            marginRight: "0.25em",
                            marginTop: "0.15em",
                        }}
                    />
                    {(users || []).map((user, index) =>
                        index !== (users || []).length - 1 ? `${user}, ` : user
                    )}
                </div>
            )}

            {/* Search Bar, Sorting Options, and Create New Project */}
            <div className="flex flex-wrap items-center justify-between mb-2 ml-6 lg:mr-0">
                <div className="flex flex-wrap items-center space-x-2 lg:space-x-2 w-full lg:w-auto">
                    {searchBarPlaceholder && (
                        <SearchInput
                            placeholder={searchBarPlaceholder}
                            context={searchContext}
                            searchMode={"onClick"}
                            className="py-6"
                        />
                    )}
                    {sortOptions && (
                        <div className="flex items-center space-x-2">
                            <Select onValueChange={handleSortChange} value={sortOption}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue>
                                        {sortOption ? `By ${sortOption}` : "Sort by"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2 decoration-2 text-sm font-bold">
                                        Sort by
                                    </div>
                                    {availableSortOptions.map((option, index) => (
                                        <SelectItem
                                            key={index}
                                            value={option.value} // required by the component
                                            onClick={() => {
                                                setSortOption(option.value); // setting the sortOption from context
                                                // Optionally, set 'descending' here as well
                                            }}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant={"default"}
                                onClick={() => setDescending(!descending)}
                                className="bg-white text-gray-600 border border-gray-200"
                                style={{ height: "40px" }}
                            >
                                {descending ? (
                                    <FontAwesomeIcon icon={faArrowDown} className="text-gray-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faArrowUp} className="text-gray-500" />
                                )}
                            </Button>
                        </div>
                    )}
                    {filterOptions && (
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2 decoration-2 text-sm font-bold">Filter by</div>
                                <div className="overflow-y-auto">
                                    {filterOptions.map((option, index) => (
                                        <SelectItem key={index} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </div>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                {onCreateNew && (
                    <Button
                        variant="default"
                        className="bg-blue-600 text-white ml-2 lg:mr-2 hover:bg-blue-700 whitespace-nowrap flex-shrink-0"
                        onClick={onCreateNew}
                        style={{ height: "40px" }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="small-icon mr-2" />
                        Create New {(title as any).slice(0, -1)}
                    </Button>
                )}
            </div>
            {navigationMenuItems && (
                <NavigationMenu
                    items={navigationMenuItems}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}
        </div>
    );
};

export default ListHeaderUI;
