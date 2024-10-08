"use client";

import {
    applyDateFilter,
    clearDateFiltersOnOptionChange,
} from "@/src/hooks/advanced-search/ui-backend-connection/updateDateFilter";
import { updateProjectFilter } from "@/src/hooks/advanced-search/ui-backend-connection/updateProjectFilter";
import { updateStatusFilter } from "@/src/hooks/advanced-search/ui-backend-connection/updateStatusFilter";
import { updateUserFilter } from "@/src/hooks/advanced-search/ui-backend-connection/updateUserFilter";
import { ProjectSmall } from "@/src/types/projectTypes";
import { User } from "@/src/types/userTypes";
import { ComparisonFilter } from "@/src/types/utilsTypes";
import React, { useContext, useEffect, useRef, useState } from "react";

export type BrowseSubmissionsSearchContextType = {
    searchByField?: string;
    searchByCategory?: string;
    searchByCategoryField?: string;
    caseSensitive?: boolean;
    inputQuery: string;
    sortOption: string;
    descending: boolean;
    filters: Record<string, any>;
    negativeFilters?: Record<string, any>;
    comparisonFilters?: Record<string, ComparisonFilter[]>;
    userSetStates: {
        dateFilterOn: boolean;
        userFilterOn: boolean;
        projectFilterOn: boolean;
        statusFilterOn: boolean;
        users: User[];
        projects: ProjectSmall[];
        status: string;
        startDate: Date | undefined;
        endDate: Date | undefined;
        selectedDateOption: string;
        setDateFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setUserFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setProjectFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setStatusFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setUsers: React.Dispatch<React.SetStateAction<User[]>>;
        setProjects: React.Dispatch<React.SetStateAction<ProjectSmall[]>>;
        setStatus: React.Dispatch<React.SetStateAction<string>>;
        setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
        setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
        setSelectedDateOption: React.Dispatch<React.SetStateAction<string>>;
    };
    setInputQuery: React.Dispatch<React.SetStateAction<string>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setSearchByField: React.Dispatch<React.SetStateAction<string | undefined>>;
    setSearchByCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
    setSearchByCategoryField: React.Dispatch<React.SetStateAction<string | undefined>>;
    setCaseSensitive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setNegativeFilters: React.Dispatch<React.SetStateAction<Record<string, any> | undefined>>;
    setComparisonFilters: React.Dispatch<
        React.SetStateAction<Record<string, ComparisonFilter[]> | undefined>
    >;
};

/**
 * Context for holding search options for the Browse Submissions page.
 * Listens to user inputed options and translates into key-value pairs for the useAdvancedSearch hook
 */
export const BrowseSubmissionsSearchContext = React.createContext<
    BrowseSubmissionsSearchContextType | undefined
>(undefined);

export const useBrowseSubmissionsSearchContext = (): BrowseSubmissionsSearchContextType => {
    const context = useContext(BrowseSubmissionsSearchContext);
    if (!context) {
        throw new Error(
            "Please use BrowseSubmissionsSearchContext within an BrowseSubmissionsSearchContextProvider"
        );
    }
    return context;
};

export const BrowseSubmissionsSearchProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    // End result states
    const [searchByField, setSearchByField] = useState<string | undefined>("title");
    const [searchByCategory, setSearchByCategory] = useState<string | undefined>(undefined);
    const [searchByCategoryField, setSearchByCategoryField] = useState<string | undefined>(
        undefined
    );
    const [caseSensitive, setCaseSensitive] = useState<boolean | undefined>(undefined);
    const [inputQuery, setInputQuery] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("updated_at");
    const [descending, setDescending] = useState<boolean>(true);
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [negativeFilters, setNegativeFilters] = useState<Record<string, any> | undefined>(
        undefined
    );
    const [comparisonFilters, setComparisonFilters] = useState<
        Record<string, ComparisonFilter[]> | undefined
    >(undefined);

    // Options set by user
    const [userFilterOn, setUserFilterOn] = useState<boolean>(false);
    const [projectFilterOn, setProjectFilterOn] = useState<boolean>(false);
    const [statusFilterOn, setStatusFilterOn] = useState<boolean>(false);
    const [dateFilterOn, setDateFilterOn] = useState<boolean>(false);

    const [users, setUsers] = useState<User[]>([]);

    const [projects, setProjects] = useState<ProjectSmall[]>([]);

    const [status, setStatus] = useState<string>("Accepted");

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedDateOption, setSelectedDateOption] = useState<string>("created_at");

    // Update final results
    // - Users filter
    useEffect(() => {
        updateUserFilter(userFilterOn, users, filters, setFilters);
    }, [userFilterOn, users]);

    // - Projects filter
    useEffect(() => {
        updateProjectFilter(projectFilterOn, projects, filters, setFilters, "Management");
    }, [projectFilterOn, projects]);

    // - Status filter
    useEffect(() => {
        updateStatusFilter(statusFilterOn, status, filters, setFilters);
    }, [statusFilterOn, status]);

    // - Date filter
    const prevSelectedDateOption = useRef(selectedDateOption);

    useEffect(() => {
        // Check if selectedDateOption has changed
        const selectedDateOptionChanged = prevSelectedDateOption.current !== selectedDateOption;
        prevSelectedDateOption.current = selectedDateOption;

        if (selectedDateOptionChanged && dateFilterOn) {
            // Clear if selectedDateOption changes and filter is on
            clearDateFiltersOnOptionChange(
                dateFilterOn,
                comparisonFilters,
                setComparisonFilters,
                setStartDate,
                setEndDate
            );
        } else {
            // Apply or remove date filters
            applyDateFilter(
                dateFilterOn,
                startDate,
                endDate,
                selectedDateOption,
                comparisonFilters,
                setComparisonFilters
            );
        }
    }, [dateFilterOn, startDate, endDate, selectedDateOption]);

    // States set by user
    const userSetStates = {
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
    };

    return (
        <BrowseSubmissionsSearchContext.Provider
            value={{
                searchByField,
                searchByCategory,
                searchByCategoryField,
                caseSensitive,
                inputQuery,
                sortOption,
                descending,
                filters,
                negativeFilters,
                comparisonFilters,
                setInputQuery,
                setSortOption,
                setDescending,
                setFilters,
                setSearchByField,
                setSearchByCategory,
                setSearchByCategoryField,
                setCaseSensitive,
                setNegativeFilters,
                setComparisonFilters,
                userSetStates,
            }}
        >
            {children}
        </BrowseSubmissionsSearchContext.Provider>
    );
};
