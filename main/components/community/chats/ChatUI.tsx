import { useUserId } from "@/contexts/current-user/UserIdContext";
import { Chat, ChatMessage } from "@/types/communityTypes";
import { DisplayTextWithNewLines } from "@/components/light-simple-elements/TextWithLines";
import { formatDate, formatDateForSorting } from "@/utils/functions";
import supabase from "@/utils/supabase";
import { faCaretDown, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";

interface ChatUIProps {
    chatData: Chat;
    chatMessages: ChatMessage[];
    fetchNextPage: () => void;
    hasNextPage: boolean;
}

const ChatUI: React.FC<ChatUIProps> = ({ chatData, chatMessages, fetchNextPage, hasNextPage }) => {
    // States
    const [newMessage, setNewMessage] = useState("");
    const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);

    // Contexts
    const currentUserId = useUserId();

    // Ref for the message list container
    const messageListRef = useRef<HTMLDivElement>(null);

    // Handle scrolling
    const handleScroll = () => {
        if (messageListRef.current) {
            const { scrollTop } = messageListRef.current;
            if (scrollTop === 0 && hasNextPage) {
                fetchNextPage();
            }
        }
    };

    // Scroll to bottom when initial messages are loaded
    useEffect(() => {
        if (chatMessages.length > 0 && !initialMessagesLoaded) {
            scrollToBottom();
            setInitialMessagesLoaded(true); // Mark initial load complete
        }
    }, [chatMessages.length, initialMessagesLoaded]);

    // Check if the message list is scrolled to the bottom
    const isScrolledToBottom = () => {
        if (!messageListRef.current) return false;

        const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
        return scrollTop + clientHeight + 20 >= scrollHeight;
    };

    // Scroll to the bottom of the message list
    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    // Handle sending messages
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;
        if (!currentUserId) {
            console.log("No current user id!");
            return;
        }

        const newMessageData = {
            chat_id: chatData.id,
            user_id: currentUserId,
            content: newMessage,
        };

        // Check if scroll is at the bottom before sending message
        const shouldScroll = isScrolledToBottom();
        console.log("shouldScroll: ", shouldScroll);

        const { error } = await supabase.from("chat_messages").insert([newMessageData]);

        if (error) {
            console.error("Error sending message: ", error);
        } else {
            setNewMessage("");
        }

        // Scroll to the bottom after sending message
        if (shouldScroll) {
            setTimeout(scrollToBottom, 300);
        }
    };

    // Format data for display
    const formatHourDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    const groupedByDay = useMemo(() => {
        const groups: { [day: string]: typeof chatMessages } = {};
    
        chatMessages?.forEach((message) => {
            const day = formatDateForSorting(message.createdAt || "");
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day]?.push(message);
        });
    
        return groups;
    }, [chatMessages]);

    const sortedGroupedMessages = useMemo(() => {
        return Object.entries(groupedByDay).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    }, [groupedByDay]);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <ChatHeader chat={chatData} currentUserId={currentUserId || ""} />

            {/* Message List */}
            <div
                ref={messageListRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-gray-100"
            >
                {sortedGroupedMessages.map(([day, messages]) => (
                    <div key={day}>
                        <div className="flex justify-center">
                            <div className="bg-white px-2 py-1 border border-gray-200 rounded-lg shadow-sm text-center text-sm text-gray-600 my-2">
                                {day}
                            </div>
                        </div>
                        {messages
                            ?.slice()
                            .reverse()
                            .map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-4 ${
                                        message.userId === currentUserId
                                            ? "flex justify-end"
                                            : "flex justify-start"
                                    }`}
                                >
                                    <div
                                        className={`px-3 py-2 border border-gray-300 rounded-lg ${
                                            message.userId === currentUserId
                                                ? "bg-blue-300"
                                                : "bg-blue-200"
                                        }`}
                                        style={{ maxWidth: "80%" }}
                                    >
                                        <DisplayTextWithNewLines text={message.content || ""} />
                                        <div
                                            className={`text-xs pt-1 text-gray-600 ${
                                                message.userId === currentUserId
                                                    ? "text-left"
                                                    : "text-right"
                                            }`}
                                        >
                                            {formatHourDate(message.createdAt || "")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <div className="bg-gray-200 p-4 flex items-center">
                <input
                    type="text"
                    className="flex-grow p-2 rounded-lg border border-gray-200 focus:ring focus:ring-opacity-50"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
