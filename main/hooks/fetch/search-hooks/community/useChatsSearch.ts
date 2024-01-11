import { Chat } from "@/types/communityTypes";
import { createUseUnifiedSearch } from "../useUnifiedSearch";
import { SmallSearchOptions } from "@/types/utilsTypes";

export const useChatsSearch = ({
    extraFilters,
    enabled,
    context,
    page,
    itemsPerPage
}: SmallSearchOptions) => {
    const useUnifiedSearch = createUseUnifiedSearch<Chat>({
        fetchGeneralDataParams: {
            tableName: "chats",
            categories: ["chat_messages", "users"],
            withCounts: true,
            options: {
                page: page || 1,
                itemsPerPage: itemsPerPage || 20,
                categoriesFetchMode: {
                    chat_messages: "fields",
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "full_name", "username"],
                    chat_messages: ["id", "content"]
                },
                categoriesLimits: {
                    chat_messages: 1
                }
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
