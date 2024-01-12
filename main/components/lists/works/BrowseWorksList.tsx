import { WorkInfo } from "@/types/infoTypes";
import WorkItem from "../../items/works/BrowseWorkItem";
import { Skeleton } from "@/components/ui/skeleton";
import BrowseNoResultsFallback from "@/components/fallback/BrowseNoResultsFallback";

type BrowseWorksListProps = {
    data: WorkInfo[];
    workType?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
};

const BrowseWorksList: React.FC<BrowseWorksListProps> = ({
    data,
    workType,
    isLoading,
    isSuccess,
}) => {
    const loadingData = [...Array(6).keys()];
    const showFallback = !isLoading && isSuccess && !!data && data.length === 0;

    if (isLoading) {
        return (
            <ul className="w-full p-4 space-y-6 overflow-x-hidden">
                {loadingData.map((item) => (
                    <Skeleton key={item} className="w-full bg-gray-300 h-10" />
                ))}
            </ul>
        );
    }

    if (showFallback) {
        return <BrowseNoResultsFallback itemType={workType} />;
    }

    return (
        <div className="w-full p-4 space-y-6">
            {data.map((item, index) => {
                return <WorkItem key={item.id} workInfo={item} />;
            })}
        </div>
    );
};

export default BrowseWorksList;
