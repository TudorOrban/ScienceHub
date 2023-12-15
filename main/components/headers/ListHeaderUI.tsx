import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDownShortWide,
    faArrowRotateRight,
    faArrowUpWideShort,
    faFilter,
    faPlus,
    faSort,
    faTrash,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { ProjectGeneralSearchContext } from "@/contexts/search-contexts/ProjectGeneralContext";
import { WorkspaceGeneralSearchContext } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { NavItem } from "@/types/infoTypes";
import { ContextType } from "@/types/utilsTypes";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import { SearchOption } from "@/types/searchTypes";
import { FallbackSearchContext } from "@/contexts/search-contexts/FallbackSearchContext";

const Breadcrumb = dynamic(() => import("@/components/elements/Breadcrumb"));
const NavigationMenu = dynamic(
    () => import("@/components/headers/NavigationMenu")
);
const Select = dynamic(() =>
    import("@/components/ui/select").then((mod) => mod.Select)
);
const SelectContent = dynamic(() =>
    import("@/components/ui/select").then((mod) => mod.SelectContent)
);
const SelectItem = dynamic(() =>
    import("@/components/ui/select").then((mod) => mod.SelectItem)
);
const SelectTrigger = dynamic(() =>
    import("@/components/ui/select").then((mod) => mod.SelectTrigger)
);
const SelectValue = dynamic(() =>
    import("@/components/ui/select").then((mod) => mod.SelectValue)
);
const SearchInput = dynamic(
    () => import("@/components/complex-elements/SearchInput")
);

interface CommonUIProps {
    breadcrumb?: boolean;
    title?: string;
    users?: string[];
    searchBarPlaceholder?: string;
    sortOptions?: SearchOption[];
    filterOptions?: SearchOption[];
    onCreateNew?: () => void;
    onDelete?: () => void;
    refetch?: () => void;
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
    refetch,
    onCreateNew,
    onDelete,
    navigationMenuItems,
    className,
    searchContext = "Workspace General",
}) => {
    // States
    const [activeTab, setActiveTab] = useState<string>("");

    const [isRefreshing, setIsRefreshing] = useState(false);

    // Search context
    const workspaceGeneralContext = useContext(WorkspaceGeneralSearchContext);
    const projectGeneralContext = useContext(ProjectGeneralSearchContext);
    const fallbackProjectsSearchContext = useContext(FallbackSearchContext);

    let context: ContextType | undefined;

    if (searchContext === "Workspace General") {
        context = workspaceGeneralContext;
    } else if (searchContext === "Project General") {
        context = projectGeneralContext;
    } else {
        context = fallbackProjectsSearchContext;
    }

    if (!context) {
        throw new Error("ListHeaderUI must be used within a SearchProvider");
    }

    const {
        filters,
        setFilters,
        sortOption,
        setSortOption,
        descending,
        setDescending,
    } = context;

    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // Handlers
    const handleSortChange = (
        value: string | React.ChangeEvent<HTMLSelectElement>
    ) => {
        let newSortOption = "";
        if (typeof value === "string") {
            newSortOption = value;
        } else {
            newSortOption = value.target.value;
        }
        setSortOption(newSortOption);
    };

    const toggleSortDirection = () => {
        setDescending(!descending);
    };

    const onRefreshClick = () => {
        setIsRefreshing(true);
        refetch?.();

        // Reset the state after a short delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    };

    return (
        <div className={`list-header-ui ${className || ""}`}>
            {/* Breadcrumb and Title */}
            {breadcrumb && (
                <div className="">
                    <Breadcrumb />
                </div>
            )}
            {title && (
                <h2
                    className="text-gray-800 text-primary mb-6 mt-4"
                    style={{ fontSize: "27px", fontWeight: 700 }}
                >
                    {title}
                </h2>
            )}
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
            <div className="flex flex-wrap items-start justify-between">
                {searchBarPlaceholder && (
                    <SearchInput
                        placeholder={searchBarPlaceholder}
                        context={searchContext}
                        searchMode={"onClick"}
                        inputClassName="w-96 my-1"
                    />
                )}
                {sortOptions && (
                    <div className="flex items-center my-1">
                        <Select
                            onValueChange={handleSortChange}
                            value={sortOption}
                        >
                            <SelectTrigger className="w-52">
                                <div className="flex items-center">
                                    <FontAwesomeIcon
                                        icon={faSort}
                                        className="small-icon text-gray-500 mr-2"
                                    />
                                    <SelectValue className="flex whitespace-nowrap">
                                        {
                                            sortOptions?.find(
                                                (option) =>
                                                    option.value === sortOption
                                            )?.label
                                        }
                                    </SelectValue>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2 decoration-2 text-sm font-bold">
                                    Sort by
                                </div>
                                {sortOptions?.map((option, index) => (
                                    <SelectItem
                                        key={index}
                                        value={option.value}
                                        onClick={() => {
                                            setSortOption(option.value);
                                        }}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant={"default"}
                            onClick={toggleSortDirection}
                            className="bg-white text-gray-600 border border-gray-200 ml-1"
                            style={{ height: "40px" }}
                        >
                            {descending ? (
                                <FontAwesomeIcon
                                    icon={faArrowDownShortWide}
                                    className="small-icon text-gray-500"
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faArrowUpWideShort}
                                    className="small-icon text-gray-500"
                                />
                            )}
                        </Button>
                    </div>
                )}
                {/* {filterOptions && (
                            <Select>
                                <SelectTrigger className="w-52">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon
                                            icon={faFilter}
                                            className="small-icon text-gray-500 mr-2"
                                        />
                                        <SelectValue placeholder="Filter by"></SelectValue>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2 decoration-2 text-sm font-bold">
                                        Filter by
                                    </div>
                                </SelectContent>
                            </Select>
                        )} */}
                <div className="flex justify-end my-1 ml-1">
                    {refetch && (
                        <Button
                            onClick={onRefreshClick}
                            className={`bg-white w-10 h-10 mr-2 border border-gray-300 hover:bg-white ${
                                isRefreshing ? "refreshing-class" : ""
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={faArrowRotateRight}
                                className={`small-icon text-gray-700 ${
                                    isRefreshing ? "fa-spin text-gray-900" : ""
                                }`}
                            />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            onClick={onDelete}
                            className="bg-white w-10h-10 mr-2 border border-gray-300 hover:bg-white"
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className={`small-icon hover:text-red-700 ${
                                    isDeleteModeOn
                                        ? "text-red-700"
                                        : "text-gray-700"
                                }`}
                            />
                        </Button>
                    )}
                    {onCreateNew && (
                        <Button
                            variant="default"
                            className="create-button"
                            onClick={onCreateNew}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="small-icon mr-0 md:mr-2"
                            />{" "}
                            <div className="hidden md:block">
                                Create New {title?.slice(0, -1)}
                            </div>
                        </Button>
                    )}
                </div>
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
