"use client";

import { useFeedbackData } from "@/hooks/fetch/data-hooks/resources/useFeedbackData";
import { useFeedbackResponses } from "@/hooks/fetch/data-hooks/resources/useFeedbackResponses";
import { FetchResult } from "@/services/fetch/fetchGeneralData";
import { Feedback, FeedbackResponse } from "@/types/resourcesTypes";
import FeedbackResponsesCard from "./FeedbackResponsesCard";
import FeedbackHeader from "./FeedbackHeader";
import { DisplayTextWithNewLines } from "@/components/light-simple-elements/TextWithLines";

interface FeedbackCardProps {
    feedbackId: number;
    initialFeedbackData?: FetchResult<Feedback>;
    initialFeedbackResponsesData: FetchResult<FeedbackResponse>;
    isLoading?: boolean;
}

/**
 * Component for displaying a full feedback. Used in dynamic route.
 */
const FeedbackCard: React.FC<FeedbackCardProps> = ({
    feedbackId,
    initialFeedbackData,
    initialFeedbackResponsesData,
    isLoading,
}) => {
    // Custom hook for hydrating initial server fetch
    const feedbackData = useFeedbackData(feedbackId || 0, initialFeedbackData, !!feedbackId);
    const feedback = feedbackData.data[0];

    // TODO: Replace with an infinite query
    const feedbackResponsesData = useFeedbackResponses(
        feedbackId || 0,
        !!feedbackId,
        initialFeedbackResponsesData
    );
    const feedbackResponses = feedbackResponsesData.data;

    return (
        <div className="p-4 sm:p-8">
            <FeedbackHeader feedback={feedback} isLoading={isLoading} />

            {feedback?.content && (
                <div className="flex items-center flex-wrap p-4 bg-gray-50 border-x border-b border-gray-300 rounded-md shadow-sm">
                    <span className="text-lg font-semibold mr-2">{"Content: "}</span>
                    <DisplayTextWithNewLines text={feedback.content} />
                </div>
            )}
            <FeedbackResponsesCard
                feedbackResponses={feedbackResponses}
                feedbackId={feedback?.id}
                feedbackType="Feedback"
            />
        </div>
    );
};

export default FeedbackCard;
