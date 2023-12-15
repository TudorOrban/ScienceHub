"use client";

import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useToastsContext } from "@/contexts/general/ToastsContext";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import ActionsButton from "@/components/elements/ActionsButton";
import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import VisibilityTag from "@/components/elements/VisibilityTag";
import ToastManager, { Operation } from "@/components/light-simple-elements/ToastManager";
import { Skeleton } from "@/components/ui/skeleton";
import { handleAcceptWorkSubmission } from "@/submit-handlers/handleAcceptWorkSubmission";
import { handleSubmitWorkSubmission } from "@/submit-handlers/handleSubmitWorkSubmission";
import { WorkSubmission } from "@/types/versionControlTypes";
import { Work } from "@/types/workTypes";
import { formatDate } from "@/utils/functions";
import { faCheck, faPaste, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

interface WorkSubmissionCardProps {
    submission: WorkSubmission;
    work: Work;
    isLoading?: boolean;
    workIsLoading?: boolean;
    refetchSubmission?: () => void;
    refetchWork?: () => void;
}

const WorkSubmissionCard: React.FC<WorkSubmissionCardProps> = ({
    submission,
    work,
    isLoading,
    workIsLoading,
    refetchSubmission,
    refetchWork,
}) => {
    // States
    const [operations, setOperations] = useState<Operation[]>([]);

    // Contexts
    const currentUserId = useUserId();

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

    // console.log("DSADAS", isAuthor, isWorkMainAuthor, isCorrectVersion, submission?.initialWorkVersionId, workData.data[0]?.currentWorkVersionId);

    // Custom hooks
    const currentUserData = useUsersSmall([currentUserId || ""], !!currentUserId);

    // Handle actions
    const updateGeneral = useUpdateGeneralData();

    return (
        <div
            style={{ backgroundColor: "var(--page-header-bg-color)" }}
            className="border border-gray-200 shadow-sm rounded-b-sm"
        >
            {/* First part */}
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
                            className="bg-blue-600 px-4 py-2 border border-gray-300 text-white font-semibold rounded-md shadow-sm"
                        >
                            Submit
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2 text-gray-600">
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
                            <div className="bg-blue-800 px-4 py-2 border border-gray-300 text-gray-100 font-semibold rounded-md shadow-sm">
                                Submitted
                            </div>
                        </div>
                    )}
                    {isWorkMainAuthor && isCorrectVersion && isCorrectStatus ? (
                        <button
                            onClick={() =>
                                handleAcceptWorkSubmission(
                                    updateGeneral,
                                    submission,
                                    work,
                                    currentUserData.data[0],
                                    setOperations
                                )
                            }
                            className="bg-blue-600 px-4 py-2 border border-gray-300 text-white font-semibold rounded-md shadow-sm"
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
                                <div className="bg-blue-800 px-4 py-2 border border-gray-300 text-gray-100 font-semibold rounded-md shadow-sm">
                                    Accepted
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className="p-4">
                {updateGeneral.isLoading && (
                    <div className="absolute left-80 top-80 z-40 text-3xl">Loading</div>
                )}
                <ToastManager operations={operations} />
            </div>
        </div>
    );
};

export default WorkSubmissionCard;
