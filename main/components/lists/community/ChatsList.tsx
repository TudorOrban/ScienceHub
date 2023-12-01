import { ChatInfo } from "@/types/infoTypes";
import ChatItem from "../../items/community/ChatItem";

type ChatListProps = {
    data: ChatInfo[];
    disableNumbers?: boolean;
};

const ChatsList: React.FC<ChatListProps> = (props) => {
    return (
        <div className="w-full bg-gray-50 border-t border-gray-200">
            <ul>
                {props.data &&
                    props.data.map((item, index) => {
                        if (props.disableNumbers) {
                            return (
                                <li key={index}>
                                    <div className="text-lg ml-4">
                                        <ChatItem
                                            chatInfo={item}
                                        />
                                    </div>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index}>
                                    <div className="text-lg ml-4">
                                        <ChatItem
                                            chatInfo={item}
                                            index={index + 1}
                                        />
                                    </div>
                                </li>
                            );
                        }
                    })}
            </ul>
        </div>
    );
};

export default ChatsList;
