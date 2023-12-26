import { Chat } from "@/types/communityTypes";
import { Skeleton } from "@/components/ui/skeleton";
import ChatHeader from "./ChatHeader";

type ChatListProps = {
    chats: Chat[];
    currentUserId: string;
    isLoading?: boolean;
};

const ChatsList: React.FC<ChatListProps> = ({ chats, currentUserId, isLoading }) => {
    const loadingData = [...Array(4).keys()];
    
    if (isLoading) {
        return (
            <ul className="w-full space-y-4 bg-gray-50 border-t border-gray-200">
                {loadingData.map((item, index) => (
                    <Skeleton key={index} className="w-full h-20 bg-gray-200 m-8" />
                ))}
            </ul>
        );
    }

    return (
        <ul className="w-full bg-gray-50 border-t border-gray-200">
            {chats?.map((chat, index) => (
                <li key={chat.id}>
                    <ChatHeader chat={chat} currentUserId={currentUserId} />
                </li>
            ))}
        </ul>
    );
};

export default ChatsList;
