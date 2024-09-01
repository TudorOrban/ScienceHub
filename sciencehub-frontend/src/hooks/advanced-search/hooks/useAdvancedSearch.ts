import { UseGeneralDataParams, useGeneralDataAdvanced } from "@/src/hooks/fetch/useGeneralDataAdvanced";
import { useBrowseSearchContext } from "@/src/hooks/fetch/search-hooks/useBrowseSearchContext";

export interface UnifiedSearchParams<T> extends UseGeneralDataParams<T> {
    extraFilters?: Record<string, any>;
    contextMode?: boolean;
    context: string;
}

/**
 * Advanced version of useUnifiedSearch, used throughout Browse pages
 */
export const useAdvancedSearch = <T>(params: UnifiedSearchParams<T>) => {
    return function useUnifiedSearch() {
        // Get user options from context
        const context = useBrowseSearchContext(params.context);
        if (!context) {
            throw new Error("useUnifiedSearch must be used within a SearchProvider");
        }
        const {
            searchByField,
            caseSensitive,
            inputQuery,
            filters,
            sortOption,
            descending,
            comparisonFilters,
        } = context;

        // Merge extra filters with existing filters
        const finalFilters = { ...filters, ...params.extraFilters };

        // Insert user options
        const finalParams: UseGeneralDataParams<T> = {
            ...params,
            fetchGeneralDataParams: {
                ...params.fetchGeneralDataParams,
                options: {
                    ...params.fetchGeneralDataParams.options,
                    searchByField,
                    caseSensitive,
                    inputQuery,
                    filters: finalFilters,
                    sortOption,
                    descending,
                    comparisonFilter: comparisonFilters,
                },
            },
        };

        const queryResult = useGeneralDataAdvanced<T>(finalParams);

        return queryResult;
    };
};
