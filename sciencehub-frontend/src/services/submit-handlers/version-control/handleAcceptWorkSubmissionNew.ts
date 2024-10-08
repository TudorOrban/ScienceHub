import { FileChanges } from "@/src/types/versionControlTypes";
import { UseMutationResult } from "@tanstack/react-query";
import { getObjectNames } from "@/src/config/getObjectNames";
import { DeleteBucketInput, DeleteBucketOutput } from "@/src/services/delete/deleteGeneralBucketFile";
import { StorageError } from "@supabase/storage-js";
import { Operation } from "@/src/contexts/general/ToastsContext";
import { getWorkBucketName } from "@/src/config/worksVersionedFields.config";

/**
 * New version of the Accept Work Submission handler
 * Hits backend endpoint, updates work submission correspondingly, handles error/loading states.
 * Deletes old file if necessary (to be moved to backend as well)
 */
interface HandleAcceptWorkSubmissionParams {
    deleteGeneralBucketFile: UseMutationResult<
        DeleteBucketOutput,
        StorageError,
        Omit<DeleteBucketInput, "supabase">,
        unknown
    >;
    workSubmissionId: number;
    workId: number;
    workType: string;
    currentUserId: string;
    fileChanges: FileChanges;
    permissions: boolean;
    isAlreadyAccepted: boolean;
    setOperations: (operations: Operation[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    refetchSubmission?: () => void;
    revalidateWorkPath?: (path: string) => void;
    identifier?: string;
}

export const handleAcceptWorkSubmission = async ({
    deleteGeneralBucketFile,
    workSubmissionId,
    workId,
    workType,
    fileChanges,
    currentUserId,
    permissions,
    isAlreadyAccepted,
    setIsLoading,
    setOperations,
    refetchSubmission,
    revalidateWorkPath,
    identifier,
}: HandleAcceptWorkSubmissionParams) => {
    try {
        if (workSubmissionId && currentUserId && currentUserId !== "" && permissions) {
            setIsLoading?.(true);
            
            // Call endpoint
            const response = await fetch(
                `http://localhost:5183/api/v1/submissions/work-submissions/${workSubmissionId}/accept`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(currentUserId),
                }
            );

            // Handle error
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`An error occurred while accepting the Work Submission`, errorData);

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage: "An error occurred while accepting the Work Submission. Please try again.",
                    },
                ]);
                setIsLoading?.(false);    
                return;
            }

            // Handle success
            const newWork = await response.json();

            refetchSubmission?.();
            revalidateWorkPath?.(
                newWork.link // TODO: Handle link creation in the backend
            );
            setIsLoading?.(false);

            // Delete old bucket file if necessary
            // In the future, keep old file once enough storage is secured
            if (fileChanges?.fileToBeRemoved) {
                const deletedBucketFile = await deleteGeneralBucketFile.mutateAsync({
                    bucketName: getWorkBucketName(workType) || "",
                    filePaths: [fileChanges?.fileToBeRemoved?.bucketFilename || ""],
                });

                if (deleteGeneralBucketFile.error || deletedBucketFile.error) {
                    console.error(
                        `An error occurred while deleting the bucket file: ${fileChanges?.fileToBeRemoved?.bucketFilename} for ${workId}, ${workType}`
                    );
                    // No toast here
                }
            }
        } else if (isAlreadyAccepted) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "Submission has already been accepted.",
                },
            ]);
        } else if (!permissions) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "You do not have permissions to accept the submission.",
                },
            ]);
        }
    } catch (error) {
        console.error("An error occurred: ", error);
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Work Submission",
                customMessage: "An error occured while accepting the work. Please try again.",
            }
        ]);
        setIsLoading?.(false);
    }
};
