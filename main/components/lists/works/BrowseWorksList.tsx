import BrowseWorkItem from "../../items/works/BrowseWorkItem";
import { Skeleton } from "@/components/ui/skeleton";
import BrowseNoResultsFallback from "@/components/fallback/BrowseNoResultsFallback";
import { Work } from "@/types/workTypes";

type BrowseWorksListProps = {
    works: Work[];
    workType?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
};

const BrowseWorksList: React.FC<BrowseWorksListProps> = ({
    works,
    workType,
    isLoading,
    isSuccess,
}) => {
    const loadingData = [...Array(6).keys()];
    const showFallback = !isLoading && isSuccess && !!works && works.length === 0;

    if (isLoading) {
        return (
            <ul className="w-full p-6 space-y-6 overflow-x-hidden">
                {loadingData.map((work) => (
                    <Skeleton key={work} className="w-full bg-gray-300 h-10" />
                ))}
            </ul>
        );
    }

    if (showFallback) {
        return <BrowseNoResultsFallback itemType={workType} />;
    }

    return (
        <div className="w-full p-6 space-y-6">
            {works.map((work) => {
                return <BrowseWorkItem key={work.id} work={work} />;
            })}
        </div>
    );
};

export default BrowseWorksList;
