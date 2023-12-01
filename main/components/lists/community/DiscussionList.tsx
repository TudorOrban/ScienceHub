import DiscussionItem from "@/components/items/community/DiscussionItem";
import { DiscussionInfo } from "@/types/infoTypes";

type DiscussionListProps = {
    data: DiscussionInfo[];
    disableNumbers?: boolean;
    onDeleteDiscussion: (discussionId: number) => void;
};

const DiscussionsList: React.FC<DiscussionListProps> = (props) => {
    return (
        <div className="w-full">
            <ul>
                {props.data &&
                    props.data.map((item, index) => (
                        <li key={index}>
                            <div className="text-lg">
                                <DiscussionItem
                                    discussionInfo={item}
                                    onDeleteDiscussion={
                                        props.onDeleteDiscussion || (() => {})
                                    }
                                />
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default DiscussionsList;
