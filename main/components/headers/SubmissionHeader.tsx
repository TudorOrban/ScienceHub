import { WorkSubmission } from "@/types/versionControlTypes";
import { faCheck, faPaste } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "../ui/skeleton";
import VisibilityTag from "../elements/VisibilityTag";
import UsersAndTeamsSmallUI from "../elements/UsersAndTeamsSmallUI";
import { formatDate } from "@/utils/functions";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import { useDeleteGeneralBucketFile } from "@/hooks/delete/useDeleteGeneralBucketFile";
import { Work } from "@/types/workTypes";
import { handleSubmitWorkSubmission } from "@/submit-handlers/handleSubmitWorkSubmission";
import { handleAcceptWorkSubmission } from "@/submit-handlers/handleAcceptWorkSubmission";

interface SubmissionHeaderProps {
    submission: WorkSubmission;
    work: Work;
    refetchSubmission?: () => void;
    revalidatePath?: (path: string) => void;
    identifier?: string;
    isLoading?: boolean;
}

const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({
    submission,
    work,
    refetchSubmission,
    revalidatePath,
    identifier,
    isLoading,
}) => {
    // Contexts
    const currentUserId = useUserId();

    // - Toasts
    const { setOperations } = useToastsContext();

    // Permissions
    // - Submitting
    const isAuthor = submission?.users?.map((user) => user.id).includes(currentUserId || "");
    // - Accepting
    const isWorkMainAuthor = work?.users?.map((user) => user.id).includes(currentUserId || "");
    const isCorrectVersion = submission?.initialWorkVersionId === work?.currentWorkVersionId;
    const isAlreadyAccepted = submission?.status === "Accepted";
    const isCorrectStatus = submission?.status === "Submitted" && !isAlreadyAccepted;

    // Checks
    const isAlreadySubmitted =
        submission?.status === "Submitted" || submission?.status === "Accepted";

    // console.log("DSADAS", isAuthor, isWorkMainAuthor, isCorrectVersion, submission?.initialWorkVersionId, work?.currentWorkVersionId);

    // Custom hooks
    const currentUserData = useUsersSmall([currentUserId || ""], !!currentUserId);

    // Handle actions
    const updateGeneral = useUpdateGeneralData();
    const deleteGeneralBucketFile = useDeleteGeneralBucketFile();

    return (
        <div
            style={{ backgroundColor: "var(--page-header-bg-color)" }}
            className="border border-gray-300 shadow-sm rounded-b-sm"
        >
            {/* Header */}
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

                    <div className="flex whitespace-nowrap pt-4 pl-1 text-gray-800 font-semibold">
                        {submission?.createdAt && (
                            <div className="flex items-center mr-2">
                                Created at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(submission?.createdAt || "")}
                                </div>
                            </div>
                        )}
                        {submission?.updatedAt && (
                            <div className="flex items-center">
                                Updated at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(submission?.updatedAt || "")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right-side: Actions Buttons */}
                <div className="flex flex-col items-end justify-end space-y-2 pt-2">
                    {/* Actions Buttons */}
                    {/* <ActionsButton actions={[]} /> */}
                    {isAuthor && !isAlreadySubmitted ? (
                        <button
                            onClick={() =>
                                handleSubmitWorkSubmission(
                                    updateGeneral,
                                    submission?.id.toString(),
                                    submission?.status,
                                    submission?.users,
                                    currentUserData.data[0],
                                    setOperations
                                )
                            }
                            className="w-28 flex justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-gray-300 text-white font-semibold rounded-md shadow-sm"
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
                                    />
                                </>
                            )}
                            <div className="w-28 flex justify-center px-4 py-2 bg-blue-700 border border-gray-300 text-gray-100 font-semibold rounded-md shadow-sm">
                                Submitted
                            </div>
                        </div>
                    )}
                    {isWorkMainAuthor && isCorrectVersion && isCorrectStatus ? (
                        <button
                            onClick={() =>
                                handleAcceptWorkSubmission({
                                    updateGeneral,
                                    deleteGeneralBucketFile,
                                    workSubmission: submission,
                                    work,
                                    refetchSubmission: refetchSubmission,
                                    currentUser: currentUserData.data[0],
                                    setOperations,
                                    revalidateWorkPath: revalidatePath,
                                    identifier: identifier,
                                })
                            }
                            className="w-28 flex justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700  border border-gray-300 text-white font-semibold rounded-md shadow-sm"
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
                                        />
                                    </>
                                )}
                                <div className="w-28 flex justify-center px-4 py-2 bg-blue-700 border border-gray-300 text-gray-100 font-semibold rounded-md shadow-sm">
                                    Accepted
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            {updateGeneral.isLoading && (
                <div className="absolute left-80 top-80 z-40 text-3xl">Loading</div>
            )}
        </div>
    );
};

export default SubmissionHeader;
