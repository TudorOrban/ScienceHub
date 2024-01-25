import { FileChanges, SubmissionStatus, WorkSubmission } from "@/types/versionControlTypes";
import { Work } from "@/types/workTypes";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { User } from "@/types/userTypes";
import { getObjectNames } from "@/config/getObjectNames";
import {
    PartialWorkRecord,
    getFinalVersionWorkRecord,
} from "@/version-control-system/diff-logic/getFinalVersionWorkRecord";
import { DeleteBucketInput, DeleteBucketOutput } from "@/services/delete/deleteGeneralBucketFile";
import { StorageError } from "@supabase/storage-js";
import { toSupabaseDateFormat } from "@/utils/functions";
import { Operation } from "@/contexts/general/ToastsContext";
import { getWorkBucketName } from "@/config/worksVersionedFields.config";

// TODO: Add merge handling

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
    setOperations,
    refetchSubmission,
    revalidateWorkPath,
    identifier,
}: HandleAcceptWorkSubmissionParams) => {
    try {
        if (workSubmissionId && currentUserId && currentUserId !== "" && permissions) {
            // Call endpoint
            const response = await fetch(`http://localhost:5183/api/v1/submissions/work-submissions/${workSubmissionId}/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentUserId),
            });

            // Handle error
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`An error occurred while creating the work`, errorData);

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work",
                        customMessage: "An error occurred while creating the work.",
                    },
                ]);
                return;
            }

            // Handle success
            const newWork = await response.json();

            refetchSubmission?.();
            revalidateWorkPath?.(
                `${identifier}/works/${getObjectNames({ label: workType })?.linkName}/${workId}`
            );

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
        console.log("An error occurred: ", error);
    }
};