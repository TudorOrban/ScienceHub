import { Chat } from "@/types/communityTypes";
import { HookResult, useGeneralData } from "../../useGeneralData";

export const useChatData = (chatId: string, enabled?: boolean): HookResult<Chat> => {
    const chatData = useGeneralData<Chat>({
        fetchGeneralDataParams: {
            tableName: "chats",
            categories: ["users", "chat_messages"],
            options: {
                tableRowsIds: [chatId],
                page: 1,
                itemsPerPage: 5,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "full_name", "avatar_url"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });

    return chatData;
};