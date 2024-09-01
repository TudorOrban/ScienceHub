import { Discussion } from "@/src/types/communityTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { SmallSearchOptions } from "@/src/types/utilsTypes";

export const useDiscussionsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage,
}: SmallSearchOptions) => {
    return createUseUnifiedSearch<Discussion>({
        fetchGeneralDataParams: {
            tableName: "discussions",
            categories: ["discussion_upvotes"],
            withCounts: true,
            options: {
                tableFields: [
                    "id",
                    "created_at",
                    "title",
                    "users!discussions_user_id_fkey(id, username, full_name, avatar_url)",
                    "content",
                    "updated_at",
                ],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    discussion_upvotes: "count",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },

        extraFilters: extraFilters,
        context: context || "Workspace General",
    })();
};
