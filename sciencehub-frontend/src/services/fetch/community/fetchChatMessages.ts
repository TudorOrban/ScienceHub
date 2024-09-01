import supabase from "@/src/utils/supabase";
import { snakeCaseToCamelCase } from "../fetchGeneralData";
import { ChatMessage } from "@/src/types/communityTypes";
import { SnakeCaseObject } from "../fetchGeneralDataAdvanced";

export const fetchChatMessages = async (chatId: number, page: number, itemsPerPage: number) => {
    const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false })
        .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

    if (error || !data) {
        console.log("Error fetching chat messages: ", error);
        return;
    }

    return snakeCaseToCamelCase<ChatMessage[]>(data as SnakeCaseObject<ChatMessage[]>);
};
