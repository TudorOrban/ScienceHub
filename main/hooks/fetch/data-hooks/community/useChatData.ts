import { Chat } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useChatData = (chatId: number, enabled?: boolean): HookResult<Chat> => {
    const chatData = useGeneralData<Chat>({
        fetchGeneralDataParams: {
            tableName: "chats",
            categories: ["users"],
            options: {
                tableRowsIds: [chatId],
                tableFields: ["id", "created_at", "type", "title", "updated_at"],
                page: 1,
                itemsPerPage: 5,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "full_name", "username", "avatar_url"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    return chatData;
};