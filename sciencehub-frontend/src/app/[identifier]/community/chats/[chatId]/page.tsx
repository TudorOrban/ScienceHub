"use client";

import { useEffect, useRef, useState } from "react";
import { useChatMessages } from "@/src/hooks/fetch/data-hooks/community/useChatMessages";
import ChatUI from "@/src/components/community/chats/ChatUI";
import supabase from "@/src/utils/supabase";
import { ChatMessage, SnakeCaseChatMessage } from "@/src/types/communityTypes";
import { snakeCaseToCamelCase } from "@/src/services/fetch/fetchGeneralData";
import { useChatData } from "@/src/hooks/fetch/data-hooks/community/useChatData";

export default function ChatPage({ params: { chatId } }: { params: { chatId: string } }) {
    const itemsPerPage = 12;

    // State for existing messages
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // Ref for real-time messages
    const realTimeMessagesRef = useRef<ChatMessage[]>([]);

    // Chat metadata hook
    const chatData = useChatData(Number(chatId), true);

    // Infinite query hook for chat messages with infinite scrolling
    const { data, fetchNextPage, hasNextPage } = useChatMessages(
        Number(chatId),
        itemsPerPage,
        true
    );

    useEffect(() => {
        // Update local state with existing and real-time messages
        const flatMessages =
            data?.pages.flat().filter((message): message is ChatMessage => message !== undefined) ||
            [];
        const mergedMessages = mergeMessages(flatMessages, realTimeMessagesRef.current);
        setMessages(mergedMessages);
    }, [data]);

    useEffect(() => {
        // Subscribe to supabase real-time channel
        const chatMessageSubscription = supabase
            .channel("chat_message_changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    if (isChatMessage(payload.new)) {
                        const newMessage = snakeCaseToCamelCase<ChatMessage>(payload.new);

                        // Update real-time messages ref
                        realTimeMessagesRef.current = [newMessage, ...realTimeMessagesRef.current];

                        // Update local state
                        setMessages((currentMessages) => {
                            return mergeMessages(currentMessages, [newMessage]);
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            chatMessageSubscription.unsubscribe();
        };
    }, [chatId]);


    return (
        <ChatUI
            chatData={chatData.data[0]}
            chatMessages={messages || []}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage || false}
        />
    );
}

// Function to merge and remove duplicates
function mergeMessages(fetchedMessages: ChatMessage[], realTimeMessages: ChatMessage[]) {
    const merged = [...realTimeMessages, ...fetchedMessages];
    return merged.filter((msg, index, self) => index === self.findIndex((m) => m.id === msg.id));
}

function isChatMessage(obj: any): obj is SnakeCaseChatMessage {
    return "id" in obj && "chat_id" in obj && "user_id" in obj;
}
