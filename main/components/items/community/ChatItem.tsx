import useIdentifier from "@/hooks/utils/useIdentifier";
import { ChatInfo } from "@/types/infoTypes";
import { formatDaysAgo, truncateText } from "@/utils/functions";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ChatItemProps = {
    chatInfo: ChatInfo;
    index?: number;
};

const ChatItem: React.FC<ChatItemProps> = (props) => {
    const chatInfo = props.chatInfo;

    const router = useRouter();
    const userIds = (chatInfo.users || []).map((user) => user.id);
    const { identifier, error, isLoading } =
        useIdentifier(userIds, []) || "TudorOrban1";

    const navigateToChat = () => {
        router.push(`/${identifier}/community/chats/${chatInfo.chatId}`);
    };

    const navigateToProfile = (userId: string) => {
        router.push(`/${userId}/profile`);
    };

    return (
        <div
            className="w-full text-lg cursor-pointer border-b border-gray-200"
            onClick={navigateToChat}
        >
            <div className="flex flex-row items-center justify-between w-full p-2">
                <div className="flex flex-row items-center">
                    {chatInfo.otherUserAvatarUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden relative">
                            <Image
                                src={chatInfo.otherUserAvatarUrl}
                                alt="Picture of the user"
                                width={64}
                                height={64}
                                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    )}
                    <div className="flex-col">
                        <div className="ml-1 font-semibold flex">
                            {chatInfo.users &&
                                chatInfo.users.map((user, index, array) => (
                                    <div key={index} className="pl-2 hover:text-blue-700">
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigateToProfile(
                                                    user.username
                                                );
                                            }}
                                        >
                                            {user.fullName}
                                        </span>
                                        {index < array.length - 1 && ", "}
                                    </div>
                                ))}
                        </div>
                        <div className="flex ml-1">
                            {chatInfo.isLastMessageOwn && (
                                <div>
                                    <FontAwesomeIcon
                                        icon={faUserCheck}
                                        className="small-icon p-1 ml-1"
                                        style={{ marginTop: "2px" }}
                                    />
                                </div>
                            )}
                            {chatInfo.lastMessage && (
                                <div>
                                    {truncateText(chatInfo.lastMessage, 100)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mr-4 mt-6 text-base text-gray-600">
                    {chatInfo.lastMessageDaysAgo && (
                        <div>
                            {formatDaysAgo(Number(chatInfo.lastMessageDaysAgo))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
