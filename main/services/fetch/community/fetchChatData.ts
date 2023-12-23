import supabase from "@/utils/supabase";

const fetchChatData = async (chatId: string) => {
    const { data: chat, error } = await supabase
        .from("chats")
        .select(
            `
            id,
            created_at,
            updated_at,
            title,
            users (
                id,
                username,
                full_name,
                avatar_url
            ),
            chat_messages (
                id,
                chat_id,
                user_id,
                created_at,
                updated_at,
                content
            )
        `
        )
        .eq("id", chatId)
        .single();

    if (error) {
        throw error;
    }

    return chat;
};
