import { AcceptedData, TextDiff, WorkSubmission } from "@/types/versionControlTypes";
import { FileLocation, Work } from "@/types/workTypes";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { User } from "@/types/userTypes";
import { getObjectNames } from "@/config/getObjectNames";
import {
    PartialWorkRecord,
    getFinalVersionWorkRecord,
} from "@/version-control-system/diff-logic/getFinalVersionWorkRecord";
import {
    DeleteBucketInput,
    DeleteBucketOutput,
    deleteGeneralBucketFile,
} from "@/services/delete/deleteGeneralBucketFile";
import { StorageError } from "@supabase/storage-js";
import { toSupabaseDateFormat } from "@/utils/functions";
import { Operation } from "@/contexts/general/ToastsContext";

// TODO: Add merge handling

interface HandleAcceptWorkSubmissionParams {
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    deleteGeneralBucketFile: UseMutationResult<
        DeleteBucketOutput,
        StorageError,
        Omit<DeleteBucketInput, "supabase">,
        unknown
    >;
    workSubmission: WorkSubmission;
    work: Work;
    currentUser: User;
    setOperations: (operations: Operation[]) => void;
    refetchSubmission?: () => void;
    revalidateWorkPath?: (path: string) => void;
    identifier?: string;
}

interface WorkUpdateFields extends PartialWorkRecord {
    current_work_version_id?: number;
    dataset_location?: FileLocation;
}

export const handleAcceptWorkSubmission = async ({
    updateGeneral,
    deleteGeneralBucketFile,
    workSubmission,
    work,
    currentUser,
    setOperations,
    refetchSubmission,
    revalidateWorkPath,
    identifier,
}: HandleAcceptWorkSubmissionParams) => {
    const isWorkMainAuthor = work?.users?.map((user) => user.id).includes(currentUser.id || "");
    const isCorrectVersion = workSubmission?.initialWorkVersionId === work?.currentWorkVersionId;
    const isAlreadyAccepted = workSubmission?.status === "Accepted";
    const isCorrectStatus = workSubmission?.status === "Submitted" && !isAlreadyAccepted;
    const permissions = isWorkMainAuthor && isCorrectVersion && isCorrectStatus;

    try {
        if (workSubmission?.id && currentUser.id && currentUser.id !== "" && permissions) {
            // Apply diffs to all text fields
            // TODO: apply also public and such
            const updateRecord = getFinalVersionWorkRecord(
                work,
                workSubmission?.workDelta?.textDiffs || {}
            );
            const workNames = getObjectNames({ label: work?.workType || "" });

            // Fields to be updated
            const updateFields: WorkUpdateFields = {
                ...updateRecord,
                current_work_version_id: workSubmission.finalWorkVersionId || 0,
            };

            // Check for file modifications
            const modifiedFileLocation =
                workSubmission?.workDelta?.fileToBeAdded ||
                workSubmission?.workDelta?.fileToBeUpdated;

            if (modifiedFileLocation) {
                updateFields["dataset_location"] = modifiedFileLocation;
            }

            // Update work with modified fields + current work version + file location if necessary
            const updatedWork = await updateGeneral.mutateAsync({
                tableName: workNames?.tableName || "",
                identifierField: "id",
                identifier: work.id,
                updateFields: updateFields,
            });
            console.log("Updated work", updateGeneral);

            // Error handling
            if (updateGeneral.error || updatedWork.error) {
                console.error(
                    `An error occurred while updating dataset on accept for ${work?.id}, ${work?.workType}.`
                );

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage: "An error occurred while updating the dataset.",
                    },
                ]);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Work Submission",
                        customMessage: `${work?.workType} has been successfully updated.`,
                    },
                ]);
            }

            // Update submission status
            const updatedSubmission = await updateGeneral.mutateAsync({
                tableName: "work_submissions",
                identifierField: "id",
                identifier: workSubmission.id,
                updateFields: {
                    status: "Accepted",
                    accepted_data: {
                        date: toSupabaseDateFormat(new Date().toISOString()),
                        users: [currentUser],
                    },
                },
            });
            console.log("Updated submission", updateGeneral);

            if (updateGeneral.error || updatedSubmission.error) {
                console.error(
                    "An error occurred while updating the work submission status",
                    workSubmission.id
                );
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage:
                            "An error occurred while updating the work submission status.",
                    },
                ]);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Work Submission",
                        customMessage: `Work Submission has been successfully accepted.`,
                    },
                ]);
                console.log("Final success");
                refetchSubmission?.();
                revalidateWorkPath?.(`${identifier}/works/datasets/${work.id}`);
            }

            // TODO: Update version graph + decide if initial version should be snapshot

            // Delete old bucket file if necessary
            // In the future, keep old file once enough storage is secured
            if (workSubmission?.workDelta?.fileToBeRemoved) {
                const deletedBucketFile = await deleteGeneralBucketFile.mutateAsync({
                    bucketName: "datasets",
                    filePaths: [workSubmission?.workDelta?.fileToBeRemoved?.bucketFilename || ""],
                });

                if (deleteGeneralBucketFile.error || deletedBucketFile.error) {
                    console.error(
                        `An error occurred while deleting the bucket file: ${workSubmission?.workDelta?.fileToBeRemoved?.bucketFilename} for ${work?.id}, ${work.workType}`
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
