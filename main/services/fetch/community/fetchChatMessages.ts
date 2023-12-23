import supabase from "@/utils/supabase";
import { snakeCaseToCamelCase } from "../fetchGeneralData";
import { ChatMessage } from "@/types/communityTypes";

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

    return snakeCaseToCamelCase<ChatMessage[]>(data);
};

// export const subscribeToChatMessages = (chatId: number) => {
//     const chatMessageSubscription = supabase
//         .channel("chat_message_changes")
//         .on(
//             "postgres_changes",
//             {
//                 event: "INSERT",
//                 schema: "public",
//                 table: "chat_messages",
//                 filter: `chat_id=eq.${chatId}`,
//             },
//             (payload) => {
//                 console.log("Change received!", payload);
//                 if (isChatMessage(payload.new)) {
//                     const newMessage = snakeCaseToCamelCase<ChatMessage>(payload.new);
//                     setMessages((prevMessages) => [...prevMessages, newMessage]);
//                 } else {
//                     console.error("Received payload is not a valid ChatMessage", payload.new);
//                 }
//             }
//         )
//         .subscribe();
// };
