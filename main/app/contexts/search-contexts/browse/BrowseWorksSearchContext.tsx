"use client";

import {
    applyMetricFilter,
    clearMetricFiltersOnOptionChange,
} from "@/app/advanced-search/ui-backend-connection/updateComparisonMetricFilter";
import {
    applyDateFilter,
    clearDateFiltersOnOptionChange,
} from "@/app/advanced-search/ui-backend-connection/updateDateFilter";
import { updateProjectFilter } from "@/app/advanced-search/ui-backend-connection/updateProjectFilter";
import { updateStatusFilter } from "@/app/advanced-search/ui-backend-connection/updateStatusFilter";
import { updateUserFilter } from "@/app/advanced-search/ui-backend-connection/updateUserFilter";
import { ProjectSmall } from "@/types/projectTypes";
import { User } from "@/types/userTypes";
import { ComparisonFilter } from "@/types/utilsTypes";
import React, { useContext, useEffect, useRef, useState } from "react";

export type BrowseWorksSearchContextType = {
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
        biggerThanFilterOn: boolean;
        users: User[];
        projects: ProjectSmall[];
        status: string;
        startDate: Date | undefined;
        endDate: Date | undefined;
        selectedDateOption: string;
        selectedMetric: string;
        biggerThanMetricValue: boolean;
        metricValue: number;
        setDateFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setUserFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setProjectFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setStatusFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setBiggerThanFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
        setUsers: React.Dispatch<React.SetStateAction<User[]>>;
        setProjects: React.Dispatch<React.SetStateAction<ProjectSmall[]>>;
        setStatus: React.Dispatch<React.SetStateAction<string>>;
        setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
        setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
        setSelectedDateOption: React.Dispatch<React.SetStateAction<string>>;
        setSelectedMetric: React.Dispatch<React.SetStateAction<string>>;
        setBiggerThanMetricValue: React.Dispatch<React.SetStateAction<boolean>>;
        setMetricValue: React.Dispatch<React.SetStateAction<number>>;
    };
    setInputQuery: React.Dispatch<React.SetStateAction<string>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setSearchByField: React.Dispatch<React.SetStateAction<string | undefined>>;
    setSearchByCategory: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    setSearchByCategoryField: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    setCaseSensitive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setNegativeFilters: React.Dispatch<
        React.SetStateAction<Record<string, any> | undefined>
    >;
    setComparisonFilters: React.Dispatch<
        React.SetStateAction<Record<string, ComparisonFilter[]> | undefined>
    >;
};

export const BrowseWorksSearchContext = React.createContext<
    BrowseWorksSearchContextType | undefined
>(undefined);

export const useBrowseWorksSearchContext = (): BrowseWorksSearchContextType => {
    const context = useContext(BrowseWorksSearchContext);
    if (!context) {
        throw new Error("Please use BrowseWorksSearchContext within an BrowseWorksSearchContextProvider");
    };
    return context;
}

export const BrowseWorksSearchProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    // End result states
    const [searchByField, setSearchByField] = useState<string | undefined>(
        "title"
    );
    const [searchByCategory, setSearchByCategory] = useState<
        string | undefined
    >(undefined);
    const [searchByCategoryField, setSearchByCategoryField] = useState<
        string | undefined
    >(undefined);
    const [caseSensitive, setCaseSensitive] = useState<boolean | undefined>(
        undefined
    );
    const [inputQuery, setInputQuery] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("updated_at");
    const [descending, setDescending] = useState<boolean>(true);
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [negativeFilters, setNegativeFilters] = useState<
        Record<string, any> | undefined
    >(undefined);
    const [comparisonFilters, setComparisonFilters] = useState<
        Record<string, ComparisonFilter[]> | undefined
    >(undefined);

    // Options set by user
    const [userFilterOn, setUserFilterOn] = useState<boolean>(false);
    const [projectFilterOn, setProjectFilterOn] = useState<boolean>(false);
    const [statusFilterOn, setStatusFilterOn] = useState<boolean>(false);
    const [dateFilterOn, setDateFilterOn] = useState<boolean>(false);
    const [biggerThanFilterOn, setBiggerThanFilterOn] =
        useState<boolean>(false);

    const [users, setUsers] = useState<User[]>([]);

    const [projects, setProjects] = useState<ProjectSmall[]>([]);

    const [status, setStatus] = useState<string>("completed");

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedDateOption, setSelectedDateOption] =
        useState<string>("created_at");

    const [selectedMetric, setSelectedMetric] =
        useState<string>("research_score");
    const [biggerThanMetricValue, setBiggerThanMetricValue] =
        useState<boolean>(true);
    const [metricValue, setMetricValue] = useState<number>(0);

    // Update final results
    // - Users filter
    useEffect(() => {
        updateUserFilter(userFilterOn, users, filters, setFilters);
    }, [userFilterOn, users]);

    // - Projects filter
    useEffect(() => {
        updateProjectFilter(projectFilterOn, projects, filters, setFilters);
    }, [projectFilterOn, projects]);

    // - Status filter
    useEffect(() => {
        updateStatusFilter(statusFilterOn, status, filters, setFilters);
    }, [statusFilterOn, status]);

    // - Date filter
    const prevSelectedDateOption = useRef(selectedDateOption);

    useEffect(() => {
        // Check if selectedDateOption has changed
        const selectedDateOptionChanged =
            prevSelectedDateOption.current !== selectedDateOption;
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
        const selectedMetricChanged =
            prevSelectedMetric.current !== selectedMetric;
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
    }, [
        biggerThanFilterOn,
        metricValue,
        biggerThanMetricValue,
        selectedMetric,
    ]);

    // States set by user
    const userSetStates = {
        dateFilterOn,
        userFilterOn,
        projectFilterOn,
        statusFilterOn,
        biggerThanFilterOn,
        users,
        projects,
        status,
        startDate,
        endDate,
        selectedDateOption,
        selectedMetric,
        biggerThanMetricValue,
        metricValue,
        setDateFilterOn,
        setUserFilterOn,
        setProjectFilterOn,
        setStatusFilterOn,
        setBiggerThanFilterOn,
        setUsers,
        setProjects,
        setStatus,
        setStartDate,
        setEndDate,
        setSelectedDateOption,
        setSelectedMetric,
        setBiggerThanMetricValue,
        setMetricValue,
    };

    return (
        <BrowseWorksSearchContext.Provider
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
        </BrowseWorksSearchContext.Provider>
    );
};

// Leftovers

// User filter

// if (userFilterOn && users.length > 0) {
//     const filterUsers: string[] = filters.hasOwnProperty("users")
//         ? filters.users
//         : [];
//     const usersIds = users.map((user) => user.id);

//     if (filterUsers && usersIds && filterUsers !== usersIds) {
//         const newFilters: Record<string, string[]> = {
//             ...filters,
//             users: usersIds,
//         };

//         setFilters(newFilters);
//     }
// } else {
//     const { users, ...newFilters } = filters;
//     setFilters(newFilters);
//     // setUsers([]);
// }

// Status filter

// if (statusFilterOn) {
//     if (status && !filters.hasOwnProperty("status")) {
//         const newFilters: Record<string, any> = {
//             ...filters,
//             status: status,
//         };
//         setFilters(newFilters);
//     }
// } else {
//     const { status, ...newFilters } = filters;
//     setFilters(newFilters);
// }

// Date filter

// if (dateFilterOn) {
//     let startDateFilter: ComparisonFilter[] = [];
//     let endDateFilter: ComparisonFilter[] = [];

//     if (startDate) {
//         startDateFilter = [
//             {
//                 greaterThan: true,
//                 value: formatDateForTimestamptz(startDate),
//                 filterType: "date",
//             },
//         ];
//     }
//     if (endDate) {
//         endDateFilter = [
//             {
//                 greaterThan: false,
//                 value: formatDateForTimestamptz(endDate),
//                 filterType: "date",
//             },
//         ];
//     }

//     const existingFilters =
//         comparisonFilters?.[selectedDateOption] ?? [];

//     // Filter out only the relevant existing filters
//     const cleanedFilters = cleanComparisonFilters(
//         existingFilters,
//         "date"
//     );

//     // Combine the new and cleaned filters
//     const newComparisonFilters = [
//         ...cleanedFilters,
//         ...startDateFilter,
//         ...endDateFilter,
//     ];

//     // Update the comparisonFilters state
//     setComparisonFilters({
//         ...comparisonFilters,
//         [selectedDateOption]: newComparisonFilters,
//     });
// } else {
//     // Remove all filters related to selectedDateOption
//     if (comparisonFilters) {
//         const { [selectedDateOption]: _, ...remainingFilters } =
//             comparisonFilters;
//         setComparisonFilters(remainingFilters);
//     }
// }
// }, [startDate, endDate, selectedDateOption, dateFilterOn]);

// // Clear filters on selectedDateOption change
// useEffect(() => {
//     if (comparisonFilters && dateFilterOn) {
//         const newComparisonFilters = { ...comparisonFilters };

//         // Remove all filters related to the old selectedDateOption
//         Object.keys(newComparisonFilters).forEach((key) => {
//             newComparisonFilters[key] = cleanComparisonFilters(
//                 newComparisonFilters[key] || [],
//                 "date"
//             );

//             if (newComparisonFilters[key].length === 0) {
//                 delete newComparisonFilters[key];
//             }
//         });

//         setComparisonFilters(newComparisonFilters);
//         // Clear date variables
//         setStartDate(undefined);
//         setEndDate(undefined);
//     }
// }, [selectedDateOption]);

// Metric filter
// useEffect(() => {
//     if (biggerThanFilterOn) {
//         let metricFilter: ComparisonFilter[] = [];

//         if (metricValue) {
//             metricFilter = [
//                 {
//                     greaterThan: biggerThanMetricValue,
//                     value: metricValue,
//                     filterType: "metric",
//                 },
//             ];
//         }

//         const existingFilters = comparisonFilters?.[selectedMetric] ?? [];

//         // Use cleanComparisonFilters to remove metric filters
//         const cleanedFilters = cleanComparisonFilters(
//             existingFilters,
//             "metric"
//         );

//         // Combine the new and cleaned filters
//         const newComparisonFilters = [...cleanedFilters, ...metricFilter];

//         // Update the comparisonFilters state
//         setComparisonFilters({
//             ...comparisonFilters,
//             [selectedMetric]: newComparisonFilters,
//         });
//     } else {
//         // Remove all filters related to selectedMetric
//         if (comparisonFilters) {
//             const { [selectedMetric]: _, ...remainingFilters } =
//                 comparisonFilters;
//             setComparisonFilters(remainingFilters);
//         }
//     }
// }, [
//     biggerThanFilterOn,
//     metricValue,
//     biggerThanMetricValue,
//     selectedMetric,
// ]);

// // Clear filters on selectedMetric change
// useEffect(() => {
//     if (comparisonFilters && biggerThanFilterOn) {
//         const newComparisonFilters = { ...comparisonFilters };

//         // Remove all filters related to the old selectedMetric
//         Object.keys(newComparisonFilters).forEach((key) => {
//             newComparisonFilters[key] = cleanComparisonFilters(
//                 newComparisonFilters[key] || [],
//                 "metric"
//             );

//             if (newComparisonFilters[key].length === 0) {
//                 delete newComparisonFilters[key];
//             }
//         });

//         setComparisonFilters(newComparisonFilters);

//         // Clear metric variables
//         setMetricValue(0);
//     }
// }, [selectedMetric]);
