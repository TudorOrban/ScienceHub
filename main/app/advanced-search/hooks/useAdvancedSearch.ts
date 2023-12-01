import { UseGeneralDataParams, useGeneralDataAdvanced } from "@/app/hooks/fetch/useGeneralDataAdvanced";
import { useBrowseSearchContext } from "../../hooks/fetch/search-hooks/useBrowseSearchContext";

export interface UnifiedSearchParams extends UseGeneralDataParams {
    extraFilters?: Record<string, any>;
    contextMode?: boolean;
    context: string;
}

export const useAdvancedSearch = <T>(params: UnifiedSearchParams) => {
    return function useUnifiedSearch() {
        const context = useBrowseSearchContext(params.context);
        if (!context) {
            throw new Error(
                "useUnifiedSearch must be used within a SearchProvider"
            );
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
        const finalParams: UseGeneralDataParams = {
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
