import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { AIModel } from "@/types/workTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Function handling the upload of an AI model file
 * Hits api endpoint, updates work submission correspondingly, handles error/loading states
 * To be moved to the backend soon.
 */

export interface HandleUploadAIModelParams {
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    aiModel: AIModel;
    workSubmissionId: number;
    file: File;
    fileType: string;
    fileSubtype: string;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    refetch?: () => void;
}

export const handleUploadAIModel = async ({
    updateGeneral,
    aiModel,
    workSubmissionId,
    file,
    fileType,
    fileSubtype,
    setOpenUploadModal,
    setOperations,
    refetch,
}: HandleUploadAIModelParams) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileSubtype", fileSubtype);

    try {
        if (!aiModel.id) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "AI Model id could not be found.",
                },
            ]);
        }

        // Send request to upload the aIModel
        const response = await fetch("/api/rest/upload", {
            method: "POST",
            headers: {
                "X-FileType": fileType,
            },
            body: formData,
        });

        if (!response.ok) {
            console.error("AIModel upload failed: ", aiModel.id);
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "Error uploading AI Model.",
                },
            ]);
        }

        const data: { bucketFilename?: string; message: string } = await response.json();

        if (data?.bucketFilename) {
            // Update corresponding work submission, depending on whether a file location already exists in current version
            const fileRecord = !aiModel.fileLocation?.bucketFilename
                ? {
                      fileToBeAdded: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: fileType,
                          file_subtype: fileSubtype,
                      },
                  }
                : {
                      fileToBeRemoved: aiModel.fileLocation,
                      fileToBeUpdated: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: fileType,
                          file_subtype: fileSubtype,
                      },
                  };

            const updatedWorkSubmission = await updateGeneral.mutateAsync({
                tableName: "work_submissions",
                identifier: workSubmissionId,
                identifierField: "id",
                updateFields: {
                    file_changes: fileRecord,
                },
            });

            if (updateGeneral.error || updatedWorkSubmission.error) {
                console.error(
                    "File location update failed for aiModel submission: ",
                    aiModel.id,
                    workSubmissionId
                );
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage:
                            "Error while writing AI Model location into work submission. Please try again or reach out for support at https://sciencehub.site/resources/contact-us",
                    },
                ]);
            } else {
                // If successful, close modal and refetch work submission data
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Work Submission",
                        customMessage:
                            "The AI Model has been successfully updated and recorded into the selected submission.",
                    },
                ]);
                setOpenUploadModal(false);
                refetch?.();
            }
        }
    } catch (error) {
        console.error("Error uploading aiModel: ", error);
    }
};
