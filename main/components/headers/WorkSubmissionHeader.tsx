import { WorkSubmission } from "@/types/versionControlTypes";
import { faCheck, faPaste } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "../ui/skeleton";
import VisibilityTag from "../elements/VisibilityTag";
import UsersAndTeamsSmallUI from "../elements/UsersAndTeamsSmallUI";
import { formatDate } from "@/utils/functions";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import { useDeleteGeneralBucketFile } from "@/hooks/delete/useDeleteGeneralBucketFile";
import { Work } from "@/types/workTypes";
import { handleSubmitWorkSubmission } from "@/submit-handlers/version-control/handleSubmitWorkSubmissionNew";
import { handleAcceptWorkSubmission } from "@/submit-handlers/version-control/handleAcceptWorkSubmissionNew";
import CreatedAtUpdatedAt from "../elements/CreatedAtUpdatedAt";
import LoadingSpinner from "../elements/LoadingSpinner";
import { useState } from "react";

interface WorkSubmissionHeaderProps {
    submission: WorkSubmission;
    work: Work;
    refetchSubmission?: () => void;
    revalidatePath?: (path: string) => void;
    identifier?: string;
    isLoading?: boolean;
}

/**
 * Header for WorkSubmissionCard. Responsible for handling submission changes (submit, accept)
 */
const WorkSubmissionHeader: React.FC<WorkSubmissionHeaderProps> = ({
    submission,
    work,
    refetchSubmission,
    revalidatePath,
    identifier,
    isLoading,
}) => {
    // States
    const [isOperationLoading, setIsOperationLoading] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const { setOperations } = useToastsContext();

    // Permissions
    // - Submitting
    const isAuthor = submission?.users?.map((user) => user.id).includes(currentUserId || "");
    // - Accepting
    const isWorkMainAuthor = work?.users?.map((user) => user.id).includes(currentUserId || "");
    const isCorrectVersion = submission?.initialWorkVersionId === work?.currentWorkVersionId;
    const isAlreadyAccepted = submission?.status === "Accepted";
    const isCorrectStatus = submission?.status === "Submitted";
    const acceptPermissions = isWorkMainAuthor && isCorrectVersion && isCorrectStatus;
    const isAlreadySubmitted =
        submission?.status === "Submitted" || submission?.status === "Accepted";

    // console.log("DSADAS", isAuthor, isWorkMainAuthor, isCorrectVersion, submission?.initialWorkVersionId, work?.currentWorkVersionId);

    // Custom hooks
    const currentUserData = useUsersSmall([currentUserId || ""], !!currentUserId);
    
    const deleteGeneralBucketFile = useDeleteGeneralBucketFile();

    return (
        <div
            style={{ backgroundColor: "var(--page-header-bg-color)" }}
            className="relative border border-gray-300 shadow-sm rounded-b-sm"
        >
            <div className="flex items-start justify-between flex-wrap md:flex-nowrap px-4 md:px-10 py-4">
                {/* Left side: Title, Authors, Created At */}
                <div className="min-w-[320px] w-[320px] md:w-auto mr-4">
                    <div className="flex items-center">
                        <div
                            className="flex items-center font-semibold mb-4 mt-4 ml-6"
                            style={{ fontSize: "24px" }}
                        >
                            <FontAwesomeIcon
                                icon={faPaste}
                                className="text-gray-700 pr-2"
                                style={{
                                    width: "17px",
                                }}
                            />
                            {!isLoading ? (
                                <>{submission?.title || ""}</>
                            ) : (
                                <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                            )}
                        </div>

                        <VisibilityTag isPublic={submission?.public} />
                    </div>
                    <UsersAndTeamsSmallUI
                        label="Authors: "
                        users={submission?.users || []}
                        teams={submission?.teams || []}
                        isLoading={isLoading}
                    />

                    <CreatedAtUpdatedAt
                        createdAt={submission?.createdAt}
                        updatedAt={submission?.updatedAt}
                    />
                </div>

                {/* Right-side: Submit and Accept buttons along with corresponding info */}
                <div className="flex flex-col items-end justify-end space-y-2 pt-2">
                    {isAuthor && !isAlreadySubmitted ? (
                        <button
                            onClick={() =>
                                handleSubmitWorkSubmission({
                                    workSubmissionId: submission?.id.toString(),
                                    currentUserId: submission?.users?.[0].id || "",
                                    permissions: isAuthor && !isAlreadySubmitted,
                                    setOperations,
                                    setIsLoading: setIsOperationLoading,
                                    refetchSubmission,
                                })
                            }
                            className="w-28 flex justify-center standard-write-button"
                        >
                            Submit
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2 text-gray-600 whitespace-nowrap">
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-1" />
                            {submission?.submittedData?.date &&
                                "At " + formatDate(submission?.submittedData?.date)}
                            {submission?.submittedData?.users && (
                                <>
                                    {" "}
                                    {"by"}
                                    <UsersAndTeamsSmallUI
                                        users={submission?.submittedData?.users || []}
                                        teams={[]}
                                        isLoading={isLoading}
                                        disableIcon={true}
                                        className="lg:text-lg"
                                    />
                                </>
                            )}
                            <div className="w-28 flex justify-center standard-write-button">
                                Submitted
                            </div>
                        </div>
                    )}
                    {isWorkMainAuthor && isCorrectVersion && isCorrectStatus ? (
                        <button
                            onClick={() =>
                                handleAcceptWorkSubmission({
                                    deleteGeneralBucketFile,
                                    workSubmissionId: submission.id,
                                    workId: work.id,
                                    workType: work.workType,
                                    currentUserId: currentUserData.data[0].id,
                                    permissions: acceptPermissions || false,
                                    isAlreadyAccepted,
                                    fileChanges: submission.fileChanges || {},
                                    refetchSubmission: refetchSubmission,
                                    setIsLoading: setIsOperationLoading,
                                    setOperations,
                                    revalidateWorkPath: revalidatePath,
                                    identifier: identifier,
                                })
                            }
                            className="w-28 flex justify-center standard-write-button"
                        >
                            Accept
                        </button>
                    ) : (
                        submission?.status === "Accepted" && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-1" />
                                {submission?.acceptedData?.date &&
                                    "At " + formatDate(submission?.acceptedData?.date)}
                                {submission?.acceptedData?.users && (
                                    <>
                                        {" "}
                                        {"by"}
                                        <UsersAndTeamsSmallUI
                                            users={submission?.acceptedData?.users || []}
                                            teams={[]}
                                            isLoading={isLoading}
                                            disableIcon={true}
                                            className="lg:text-lg"
                                        />
                                    </>
                                )}
                                <div className="w-28 flex justify-center standard-write-button">
                                    Accepted
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            {isOperationLoading && <LoadingSpinner />}
        </div>
    );
};

export default WorkSubmissionHeader;
