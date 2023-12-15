import { MediumSearchOptions } from "@/types/searchTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { Bookmark } from "@/types/communityTypes";

export const useBookmarksSearch = ({
    tableFilters,
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
}: MediumSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Bookmark>({
        fetchGeneralDataParams: {
            tableName: "bookmarks",
            categories: [],
            withCounts: true,
            options: {
                tableFilters: tableFilters,
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
        extraFilters: extraFilters,
        context: context || "Workspace General",
    });
    
    return useUnifiedSearch();
};