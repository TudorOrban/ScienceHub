"use client";

import {
    applyMetricFilter,
    clearMetricFiltersOnOptionChange,
} from "@/src/hooks/advanced-search/ui-backend-connection/updateComparisonMetricFilter";
import {
    applyDateFilter,
    clearDateFiltersOnOptionChange,
} from "@/src/hooks/advanced-search/ui-backend-connection/updateDateFilter";
import { updateUserFilter } from "@/src/hooks/advanced-search/ui-backend-connection/updateUserFilter";
import { User } from "@/src/types/userTypes";
import { ComparisonFilter } from "@/src/types/utilsTypes";
import React, { useContext, useEffect, useRef, useState } from "react";

export type BrowseProjectsSearchContextType = {
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
        biggerThanFilterOn: boolean;
        fieldOfResearchFilterOn: boolean;
        users: User[];
        startDate: Date | undefined;
        endDate: Date | undefined;
        selectedDateOption: string;
        selectedMetric: string;
        biggerThanMetricValue: boolean;
        metricValue: number;
        fieldOfResearch: string;
        setDateFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setUserFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setBiggerThanFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setFieldOfResearchFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setUsers: React.Dispatch<React.SetStateAction<User[]>>;
        setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
        setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
        setSelectedDateOption: React.Dispatch<React.SetStateAction<string>>;
        setSelectedMetric: React.Dispatch<React.SetStateAction<string>>;
        setBiggerThanMetricValue: React.Dispatch<React.SetStateAction<boolean>>;
        setMetricValue: React.Dispatch<React.SetStateAction<number>>;
        setFieldOfResearch: React.Dispatch<React.SetStateAction<string>>;
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
 * Context for holding search options for the Browse Pages page.
 * Listens to user inputed options and translates into key-value pairs for the useAdvancedSearch hook.
 */
export const BrowseProjectsSearchContext = React.createContext<
    BrowseProjectsSearchContextType | undefined
>(undefined);

export const useBrowseProjectsSearchContext = (): BrowseProjectsSearchContextType => {
    const context = useContext(BrowseProjectsSearchContext);
    if (!context) {
        throw new Error(
            "Please use BrowseProjectsSearchContext within an BrowseProjectsSearchContextProvider"
        );
    }
    return context;
};

export const BrowseProjectsSearchProvider: React.FC<{
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
    const [dateFilterOn, setDateFilterOn] = useState<boolean>(false);
    const [biggerThanFilterOn, setBiggerThanFilterOn] = useState<boolean>(false);
    const [fieldOfResearchFilterOn, setFieldOfResearchFilterOn] = useState<boolean>(false);

    const [users, setUsers] = useState<User[]>([]);

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedDateOption, setSelectedDateOption] = useState<string>("updated_at");

    const [selectedMetric, setSelectedMetric] = useState<string>("research_score");
    const [biggerThanMetricValue, setBiggerThanMetricValue] = useState<boolean>(true);
    const [metricValue, setMetricValue] = useState<number>(0);
    const [fieldOfResearch, setFieldOfResearch] = useState<string>("");

    // Update final results
    // - Users filter
    useEffect(() => {
        updateUserFilter(userFilterOn, users, filters, setFilters);
    }, [userFilterOn, users]);

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

    // - Metric filter
    const prevSelectedMetric = useRef(selectedMetric);

    useEffect(() => {
        // Check if selectedMetric has changed
        const selectedMetricChanged = prevSelectedMetric.current !== selectedMetric;
        prevSelectedMetric.current = selectedMetric;

        if (selectedMetricChanged && biggerThanFilterOn) {
            // Clear if selectedMetric changes
            clearMetricFiltersOnOptionChange(
                biggerThanFilterOn,
                comparisonFilters,
                setComparisonFilters,
                setMetricValue
            );
        } else {
            // Apply or remove metric filters
            applyMetricFilter(
                biggerThanFilterOn,
                metricValue,
                biggerThanMetricValue,
                selectedMetric,
                comparisonFilters,
                setComparisonFilters
            );
        }
    }, [biggerThanFilterOn, metricValue, biggerThanMetricValue, selectedMetric]);

    // States set by user
    const userSetStates = {
        dateFilterOn,
        userFilterOn,
        biggerThanFilterOn,
        fieldOfResearchFilterOn,
        users,
        startDate,
        endDate,
        selectedDateOption,
        selectedMetric,
        biggerThanMetricValue,
        metricValue,
        fieldOfResearch,
        setDateFilterOn,
        setUserFilterOn,
        setBiggerThanFilterOn,
        setFieldOfResearchFilterOn,
        setUsers,
        setStartDate,
        setEndDate,
        setSelectedDateOption,
        setSelectedMetric,
        setBiggerThanMetricValue,
        setMetricValue,
        setFieldOfResearch,
    };

    return (
        <BrowseProjectsSearchContext.Provider
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
        </BrowseProjectsSearchContext.Provider>
    );
};
