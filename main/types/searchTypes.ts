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
    negativeFilters?: Record<string, any>;
    tableFilters?: Record<string, any>;
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
};