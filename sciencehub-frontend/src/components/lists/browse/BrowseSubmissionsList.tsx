import { Skeleton } from "@/src/components/ui/skeleton";
import BrowseNoResultsFallback from "@/src/components/fallback/BrowseNoResultsFallback";
import BrowseSubmissionItem from "@/src/components/items/browse/BrowseSubmissionItem";
import { Submission } from "@/src/types/versionControlTypes";

type BrowseSubmissionsListProps = {
    submissions: Submission[];
    workType?: string;
    isLoading?: boolean;
    isSuccess?: boolean;
};

/**
 * Submission List for the Browse pages.
 */
const BrowseSubmissionsList: React.FC<BrowseSubmissionsListProps> = ({
    submissions,
    workType,
    isLoading,
    isSuccess,
}) => {
    const loadingData = [...Array(6).keys()];
    const noResultsFallback = !isLoading && isSuccess && !!submissions && submissions.length === 0;
    // TODO: Add error fallback

    if (isLoading) {
        return (
            <ul className="w-full p-6 space-y-6 overflow-x-hidden">
                {loadingData.map((submission) => (
                    <Skeleton key={submission} className="w-full bg-gray-300 h-10" />
                ))}
            </ul>
        );
    }

    if (noResultsFallback) {
        return <BrowseNoResultsFallback itemType={workType} />;
    }

    return (
        <div className="w-full p-6 space-y-6">
            {submissions.map((submission) => {
                return <BrowseSubmissionItem key={submission.id} submission={submission} />;
            })}
        </div>
    );
};

export default BrowseSubmissionsList;
