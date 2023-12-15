import { Discussion } from "@/types/communityTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { SmallSearchOptions } from "@/types/utilsTypes";

export const useDiscussionsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Discussion>({
        fetchGeneralDataParams: {
            tableName: "discussions",
            categories: ["discussion_comments"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "title", "users(id, username, full_name)", "content", "updated_at",],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    discussion_comments: "all",
                },
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