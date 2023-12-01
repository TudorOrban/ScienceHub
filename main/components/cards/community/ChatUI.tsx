import { Chat } from "@/types/communityTypes";
import { DisplayTextWithNewLines } from "@/utils/displayTextWithLines";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

interface ChatUIProps {
    chatData: Chat;
    currentUserID: string;
}

const ChatUI: React.FC<ChatUIProps> = ({ chatData, currentUserID }) => {
    const { title, chatMessages, users } = chatData;
    const otherUsers = users?.filter((user) => user.id !== currentUserID) || [];

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    const formatDay = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toDateString();
    };

    const groupedByDay = useMemo(() => {
        const groups: { [day: string]: typeof chatData.chatMessages } = {};

        chatData.chatMessages?.forEach((message) => {
            const day = formatDay(message.createdAt || "");
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day].push(message);
        });

        return groups;
    }, [chatData.chatMessages]);
    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 flex items-center">
                {users?.length === 2 ? (
                    <>
                        {/* Display avatar and name of the other user */}
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src={otherUsers[0].avatarUrl}
                                alt="User Avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="ml-4 text-lg font-semibold">
                            {otherUsers[0].fullName}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Display placeholder avatar and chat title + participants */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center">
                            <span className="text-xl text-white font-bold">
                                {title?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-4">
                            <div className="text-lg font-semibold">{title}</div>
                            <div className="text-sm">
                                Participants:{" "}
                                {users?.map((user) => user.fullName).join(", ")}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {Object.entries(groupedByDay).map(([day, messages]) => (
                    <div key={day}>
                        <div className="text-center text-sm text-gray-600 my-2">
                            {day}
                        </div>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`mb-4 ${
                                    message.userId === currentUserID
                                        ? "text-right"
                                        : "text-left"
                                }`}
                            >
                                <div
                                    className={`bg-blue-200 p-2 rounded-lg inline-block ${
                                        message.userId === currentUserID
                                            ? "bg-blue-300"
                                            : "bg-blue-200"
                                    }`}
                                >
                                    <DisplayTextWithNewLines
                                        text={message.content || ""}
                                    />
                                    <span className="text-xs text-gray-600 ml-2">
                                        {formatDate(message.createdAt || "")}
                                    </span>
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
                    className="flex-grow p-2 rounded-lg border focus:ring focus:ring-opacity-50"
                    placeholder="Type a message..."
                />
                <button className="ml-2 bg-blue-400 text-white rounded-full p-2">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
