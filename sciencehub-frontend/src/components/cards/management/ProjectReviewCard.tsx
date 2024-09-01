"use client";

import CreatedAtUpdatedAt from "@/src/components/elements/CreatedAtUpdatedAt";
import SmallProjectCard from "@/src/components/cards/small-cards/SmallProjectCard";
import UsersAndTeamsSmallUI from "@/src/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/src/components/elements/VisibilityTag";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useProjectSmallContext } from "@/src/contexts/project/ProjectSmallContext";
import { useProjectReviewData } from "@/src/hooks/fetch/data-hooks/management/useProjectReviewData";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";
import { ProjectReview } from "@/src/types/managementTypes";
import { formatDate } from "@/src/utils/functions";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProjectReviewCardProps {
    reviewId: number;
    initialReviewData?: FetchResult<ProjectReview>;
    isLoading?: boolean;
}

/**
 * Component for displaying a full project review. Used in dynamic route.
 */
const ProjectReviewCard: React.FC<ProjectReviewCardProps> = ({
    reviewId,
    initialReviewData,
    isLoading,
}) => {
    // Contexts
    const { projectSmall } = useProjectSmallContext();

    // Custom hooks for hydrating initial server fetch
    const reviewData = useProjectReviewData(reviewId || 0, !!reviewId, initialReviewData);
    const review = reviewData.data[0];

    return (
        <div>
            {/* Header */}
            <div
                className="flex items-start justify-between flex-wrap md:flex-nowrap px-4 md:px-10 py-4 border border-gray-300 shadow-sm rounded-b-sm"
                style={{ backgroundColor: "var(--page-header-bg-color)" }}
            >
                {/* Left side: Title, Authors, Created At */}
                <div className="min-w-[320px] w-[320px] md:w-auto mr-4">
                    <div className="flex items-center">
                        <div
                            className="flex items-center font-semibold mb-4 mt-4 ml-6"
                            style={{ fontSize: "24px" }}
                        >
                            <FontAwesomeIcon
                                icon={faCircleInfo}
                                className="text-gray-700 pr-2"
                                style={{
                                    width: "17px",
                                }}
                            />
                            {!isLoading ? (
                                <>{review?.title || ""}</>
                            ) : (
                                <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                            )}
                        </div>

                        <VisibilityTag isPublic={review?.public} />
                    </div>
                    <UsersAndTeamsSmallUI
                        label="Authors: "
                        users={review?.users || []}
                        teams={review?.teams || []}
                        isLoading={isLoading}
                    />

                    <CreatedAtUpdatedAt
                        createdAt={review?.createdAt}
                        updatedAt={review?.updatedAt}
                    />
                </div>

                {/* Right-side: Actions Buttons */}
                <div className="flex flex-col items-end justify-end space-y-2 pt-2">
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">{"Project:"}</span>
                        <SmallProjectCard projectSmall={projectSmall} />
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">{"Status:"}</span>
                        <span>{review?.status}</span>
                    </div>
                </div>
            </div>
            {review?.description && (
                <div className="flex items-center flex-wrap p-4">
                    <span className="text-lg font-semibold">{"Description: "}</span>
                    <p className="ml-2">{review?.description}</p>
                </div>
            )}
            {review?.content && (
                <div className="flex items-center flex-wrap p-4">
                    <span className="text-lg font-semibold">{"Content: "}</span>
                    <p className="ml-2">{review?.content}</p>
                </div>
            )}
        </div>
    );
};

export default ProjectReviewCard;
