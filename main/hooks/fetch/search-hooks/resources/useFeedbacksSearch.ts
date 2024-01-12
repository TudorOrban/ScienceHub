import { Feedback } from "@/types/resourcesTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { SmallSearchOptions } from "@/types/utilsTypes";

export const useFeedbacksSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Feedback>({
        fetchGeneralDataParams: {
            tableName: "feedbacks",
            categories: ["feedback_responses", "users"],
            withCounts: true,
            options: {
                tableFields: ["id", "created_at", "updated_at", "public", "link", "tags", "title", "description", "content"],
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    feedback_messages: "all",
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "full_name", "username"],
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
