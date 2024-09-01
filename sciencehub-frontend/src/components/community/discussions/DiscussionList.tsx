import DiscussionCard from "@/src/components/community/discussions/DiscussionCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Discussion } from "@/src/types/communityTypes";

type DiscussionListProps = {
    discussions: Discussion[];
    isLoading?: boolean;
};

const DiscussionsList: React.FC<DiscussionListProps> = ({ discussions, isLoading }) => {
    const loadingData = [...Array(4).keys()];

    if (isLoading) {
        return (
            <ul className="space-y-4">
                {loadingData.map((item, index) => (
                    <Skeleton key={index} className="w-full h-40 m-4 bg-gray-200" />
                ))}
            </ul>
        )
    }

    return (
        <ul>
            {discussions?.map((discussion, index) => (
                <li key={index}>
                    <DiscussionCard discussion={discussion} comments={[]} postCommentBarOff={true} />
                </li>
            ))}
        </ul>
    );
};

export default DiscussionsList;
