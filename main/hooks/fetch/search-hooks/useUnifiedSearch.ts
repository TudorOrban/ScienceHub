
import { UseGeneralDataParams, useGeneralData } from "../useGeneralData";
import { useSearchContext } from "./useSearchContext";

export interface UnifiedSearchParams<T> extends UseGeneralDataParams<T> {
    extraFilters?: Record<string, any>;
    negativeFilters?: Record<string, any>;
    browseMode?: boolean;
    context?: string;
}

export const createUseUnifiedSearch = <T>(params: UnifiedSearchParams<T>) => {
    return function useUnifiedSearch() {
        const context = useSearchContext(params.context);

        if (!context) {
            throw new Error(
                "useUnifiedSearch must be used within a SearchProvider"
            );
        }

        // Context for user options
        const { inputQuery, filters, sortOption, descending } = context;

        // Merge extra filters with existing filters
        const finalFilters = { ...filters, ...params.extraFilters };

        // Insert user options
        const finalParams: UseGeneralDataParams<T> = {
            ...params,
            fetchGeneralDataParams: {
                ...params.fetchGeneralDataParams,
                options: {
                    ...params.fetchGeneralDataParams.options,
                    inputQuery,
                    filters: finalFilters,
                    negativeFilters: params.negativeFilters,
                    sortOption,
                    descending,
                },
            },
        };


        const queryResult = useGeneralData<T>(finalParams);

        return queryResult;
    };
};
