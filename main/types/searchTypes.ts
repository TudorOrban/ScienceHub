import { SmallSearchOptions } from "./utilsTypes";

// Simple
export type SearchOption = {
    label: string;
    value: string;
};

export type FilterOption = {
    label: string;
    value: Record<string, any>;
}

export interface MediumSearchOptions extends SmallSearchOptions {
    tableRowsIds?: number[];
    negativeFilters?: Record<string, any>;
    tableFilters?: Record<string, any>;
}


// New Types
export interface PaginatedResults<T> {
    data: T[];
    totalCount?: number;
}

export interface Result<T> {
    data: T;
    error?: StdError;
    isLoading?: boolean;
}

export interface StdError {
    title?: string;
    message?: string;
    code?: number;
}



export type AvailableSearchOptions = {
    availableSortOptions?: SearchOption[];
    availableFilterOptions?: FilterOption[];
    availableStatusOptions?: SearchOption[];
    availableUserTypeOptions?: SearchOption[];
    availableUserFieldOptions?: SearchOption[];
    availableDateOptions?: SearchOption[];
};

// Advanced


export type AvailableSearchOptionsAdvanced = {
    availableSearchByFieldOptions?: SearchOption[];
    availableSearchByCategoryOptions?: SearchOption[];
    availableSearchByCategoryFieldsOptions?: SearchOption[];
    availableSortOptions?: SearchOption[];
    availableStatusOptions?: SearchOption[];
    availableUserTypeOptions?: SearchOption[];
    availableUserFieldOptions?: SearchOption[];
    availableDateOptions?: SearchOption[];
    availableMetricOptions?: SearchOption[];
    availableFieldsOfResearch?: SearchOption[];
};