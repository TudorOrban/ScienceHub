import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import { IssueResponse } from "@/src/types/managementTypes";
import { calculateDaysAgo, formatDaysAgo } from "@/src/utils/functions";
import supabase from "@/src/utils/supabase";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface IssueResponsesCardProps {
    issueResponses: IssueResponse[];
    issueId: number;
    issueType: string;
}

const IssueResponsesCard: React.FC<IssueResponsesCardProps> = ({
    issueResponses,
    issueId,
    issueType,
}) => {
    // States
    const [addResponse, setAddResponse] = useState<boolean>(false);
    const [newResponse, setNewResponse] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Contexts
    const router = useRouter();
    const currentUserId = useUserId();

    // Post response handler
    const handlePostResponse = async (issueId: number, issueType: string, newResponse: string) => {
        if (newResponse.trim() === "") return;
        if (!currentUserId) {
            console.log("No current user id!");
            return;
        }

        const tableName =
            issueType === "Project Issue"
                ? "project_issue"
                : issueType === "Work Issue"
                ? "work_issue"
                : undefined;
        if (!tableName) {
            console.log("Issue type was not defined!");
            return;
        }

        const newResponseData = {
            [`${tableName}_id`]: issueId,
            user_id: currentUserId,
            content: newResponse,
        };

        const { error } = await supabase.from(`${tableName}_responses`).insert([newResponseData]);

        if (error) {
            console.log("Error posting the response: ", error);
        } else {
            setNewResponse("");
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center pb-2">
                <span className="text-lg font-semibold">{"Responses"}</span>
                <span className="text-gray-800 ml-2">{`(${issueResponses?.length || 0})`}</span>
                <button
                    onClick={() => setAddResponse(!addResponse)}
                    className="flex items-center ml-2 text-blue-600 hover:text-blue-700"
                >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                    {"Add Response"}
                </button>
            </div>

            {/* Add Response field */}
            {addResponse && (
                <div className="w-full border-x border-gray-300 bg-gray-50">
                    <textarea
                        ref={textareaRef}
                        id="newResponse"
                        placeholder="Add response..."
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        className="w-full p-2 focus:outline-none border border-gray-300 rounded-md shadow-sm overflow-y-hidden"
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={() => handlePostResponse(issueId, issueType, newResponse)}
                            className="standard-write-button"
                        >
                            Post Response
                        </button>
                    </div>
                </div>
            )}
            
            {/* Responses list */}
            <ul className="w-full space-y-4">
                {issueResponses?.length > 0 &&
                    issueResponses.map((issueResponse) => (
                        <li
                            key={issueResponse.id}
                            className="bg-gray-50 border border-gray-300 rounded-md shadow-sm"
                        >
                            <div className="flex items-center p-4">
                                {issueResponse?.users?.avatarUrl && (
                                    <Image
                                        src={issueResponse?.users?.avatarUrl}
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
                                                `/${issueResponse?.users?.username}/profile`
                                            );
                                        }}
                                    >
                                        {issueResponse?.users?.fullName}
                                    </span>
                                    <div className="text-sm text-gray-500">
                                        {issueResponse.createdAt && (
                                            <span>
                                                {formatDaysAgo(
                                                    calculateDaysAgo(issueResponse.createdAt)
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 pb-4">
                                {issueResponse.content && (
                                    <p className="text-base mt-2">{issueResponse.content}</p>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default IssueResponsesCard;
