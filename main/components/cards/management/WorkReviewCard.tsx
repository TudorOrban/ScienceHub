"use client";

import SmallWorkCard from "@/components/elements/SmallWorkCard";
import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/components/elements/VisibilityTag";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkReviewData } from "@/hooks/fetch/data-hooks/management/useWorkReviewData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { WorkReview } from "@/types/managementTypes";
import { formatDate } from "@/utils/functions";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface WorkReviewCardProps {
    reviewId: number;
    initialReviewData?: FetchResult<WorkReview>;
    isLoading?: boolean;
}

const WorkReviewCard: React.FC<WorkReviewCardProps> = ({
    reviewId,
    initialReviewData,
    isLoading,
}) => {

    // Custom hook for hydrating initial server fetch
    const reviewData = useWorkReviewData(reviewId || 0, !!reviewId);
    const review = reviewData.data[0];


    return (
        <div>
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

                    <div className="flex whitespace-nowrap py-4 pl-1 text-gray-800 font-semibold">
                        {review?.createdAt && (
                            <div className="flex items-center mr-2">
                                Created at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(review?.createdAt || "")}
                                </div>
                            </div>
                        )}
                        {review?.updatedAt && (
                            <div className="flex items-center">
                                Updated at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(review?.updatedAt || "")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right-side: Actions Buttons */}
                <div className="flex flex-col items-end justify-end space-y-2 pt-2">
                    {/* <div className="flex items-center">
                        <span className="font-semibold mr-2">{"Work:"}</span>
                        <SmallWorkCard workSmall={workSmall} />
                    </div> */}
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

export default WorkReviewCard;
