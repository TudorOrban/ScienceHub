import { useUserId } from "@/contexts/current-user/UserIdContext";
import { Chat, ChatMessage } from "@/types/communityTypes";
import { DisplayTextWithNewLines } from "@/utils/displayTextWithLines";
import { formatDate } from "@/utils/functions";
import supabase from "@/utils/supabase";
import { faCaretDown, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";

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

    // Function to handle scroll
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

    // Function to check if the message list is scrolled to the bottom
    const isScrolledToBottom = () => {
        if (!messageListRef.current) return false;

        const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
        return scrollTop + clientHeight >= scrollHeight;
    };

    // Function to scroll to the bottom of the message list
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

        const { error } = await supabase.from("chat_messages").insert([newMessageData]);

        if (error) {
            console.error("Error sending message: ", error);
        } else {
            setNewMessage("");
        }

        if (shouldScroll) {
            setTimeout(scrollToBottom, 200);
        }
    };

    // Format data for display
    const otherUsers = chatData?.users?.filter((user) => user.id !== currentUserId) || [];

    const formatHourDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    const groupedByDay = useMemo(() => {
        const groups: { [day: string]: typeof chatMessages } = {};

        chatMessages?.forEach((message) => {
            const day = formatDate(message.createdAt || "");
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day]?.push(message);
        });

        return groups;
    }, [chatMessages]);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <div className="bg-white text-gray-900 p-4 flex items-center border-b border-gray-400 shadow-sm">
                {chatData?.users?.length === 2 ? (
                    <>
                        {/* Display avatar and name of the other user */}
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src={otherUsers[0].avatarUrl}
                                alt="User Avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="ml-4 text-lg font-semibold">{otherUsers[0].fullName}</div>
                    </>
                ) : (
                    <>
                        {/* Display placeholder avatar and chat title + participants */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
                            <span className="text-xl text-white font-bold">
                                {chatData?.title?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-4">
                            <div className="text-lg font-semibold">{chatData?.title}</div>
                            <div className="text-sm">
                                Participants:{" "}
                                {chatData?.users?.map((user) => user.fullName).join(", ")}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Message List */}
            <div
                ref={messageListRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-gray-100"
            >
                {Object.entries(groupedByDay).map(([day, messages]) => (
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
                    className="ml-2 bg-blue-400 text-white rounded-full p-2"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
