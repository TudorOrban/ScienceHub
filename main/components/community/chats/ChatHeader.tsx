import { Chat } from "@/types/communityTypes";
import Link from "next/link";

interface ChatHeaderProps {
    chat: Chat;
    currentUserId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, currentUserId }) => {
    const currentUser = chat?.users?.find((user) => user.id === currentUserId);
    const otherUsers = chat?.users?.filter((user) => user.id !== currentUserId) || [];
    const chatLink = `/${currentUser?.username}/community/chats/${chat?.id}`;

    return (
        <Link href={chatLink} className="bg-white text-gray-900 p-4 flex items-center border-b border-gray-400 shadow-sm">
            {chat?.users?.length === 2 ? (
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
                            {chat?.title?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="ml-4">
                        <div className="text-lg font-semibold">{chat?.title}</div>
                        <div className="text-sm">
                            Participants: {chat?.users?.map((user) => user.fullName).join(", ")}
                        </div>
                    </div>
                </>
            )}
        </Link>
    );
};

export default ChatHeader;