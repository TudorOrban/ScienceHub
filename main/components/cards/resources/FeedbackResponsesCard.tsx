import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { FeedbackResponse } from "@/types/resourcesTypes";
import { calculateDaysAgo, formatDaysAgo } from "@/utils/functions";
import supabase from "@/utils/supabase";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useRef, useState } from "react";

interface FeedbackResponsesCardProps {
    feedbackResponses: FeedbackResponse[];
    feedbackId: number;
    feedbackType: string;
}

/**
 * Component for displaying a feedback's responses.
 */
const FeedbackResponsesCard: React.FC<FeedbackResponsesCardProps> = ({
    feedbackResponses,
    feedbackId,
    feedbackType,
}) => {
    // States
    const [addResponse, setAddResponse] = useState<boolean>(false);
    const [newResponse, setNewResponse] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Contexts
    const router = useRouter();
    const currentUserId = useUserId();
    const { setOperations } = useToastsContext();

    // Post response handler
    const handlePostResponse = async (
        feedbackId: number,
        feedbackType: string,
        newResponse: string
    ) => {
        if (newResponse.trim() === "") return;
        if (!currentUserId) {
            console.log("No current user id!");
            return;
        }

        const newResponseData = {
            [`feedback_id`]: feedbackId,
            user_id: currentUserId,
            content: newResponse,
        };

        const { error } = await supabase.from(`feedback_responses`).insert([newResponseData]);

        if (error) {
            console.log("Error posting the response: ", error);
            setOperations([
                {
                    operationType: "create",
                    operationOutcome: "error",
                    entityType: "Feedback Response",
                    customMessage: `An error occurred while creating the feedback response.`,
                },
            ]);
        } else {
            setNewResponse("");
            setOperations([
                {
                    operationType: "create",
                    operationOutcome: "success",
                    entityType: "Feedback Response",
                    customMessage: `The feedback response has been posted.`,
                },
            ]);
        }
    };

    return (
        <div className="pt-4">
            <div className="flex items-center pb-4">
                <span className="text-lg font-semibold">{"Responses"}</span>
                <span className="text-gray-800 ml-2">{`(${feedbackResponses?.length || 0})`}</span>
                <button
                    onClick={() => setAddResponse(!addResponse)}
                    className="flex items-center ml-2 text-blue-600 hover:text-blue-700 whitespace-nowrap"
                >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                    {"Add Response"}
                </button>
            </div>

            {/* Add response field */}
            {addResponse && (
                <div className="w-full border-x border-gray-300 bg-gray-50">
                    <textarea
                        ref={textareaRef}
                        id="newFeedback"
                        placeholder="Add feedback..."
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        className="w-full p-2 focus:outline-none border border-gray-300 rounded-md shadow-sm overflow-y-hidden"
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={() =>
                                handlePostResponse(feedbackId, feedbackType, newResponse)
                            }
                            className="standard-write-button"
                        >
                            Post Response
                        </button>
                    </div>
                </div>
            )}

            {/* Responses */}
            <ul className="w-full space-y-4">
                {feedbackResponses?.length > 0 &&
                    feedbackResponses.map((feedbackResponse) => (
                        <li
                            key={feedbackResponse.id}
                            className="bg-gray-50 border border-gray-300 rounded-md shadow-sm"
                        >
                            <div className="flex items-center p-4">
                                {feedbackResponse?.users?.avatarUrl && (
                                    <Image
                                        src={feedbackResponse?.users?.avatarUrl}
                                        alt="Picture of the user"
                                        width={64}
                                        height={64}
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div className="ml-4">
                                    <span
                                        className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(
                                                `/${feedbackResponse?.users?.username}/profile`
                                            );
                                        }}
                                    >
                                        {feedbackResponse?.users?.fullName}
                                    </span>
                                    <div className="text-sm text-gray-500">
                                        {feedbackResponse.createdAt && (
                                            <span>
                                                {formatDaysAgo(
                                                    calculateDaysAgo(feedbackResponse.createdAt)
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 pb-4">
                                {feedbackResponse.content && (
                                    <p className="text-base mt-2">{feedbackResponse.content}</p>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default FeedbackResponsesCard;
