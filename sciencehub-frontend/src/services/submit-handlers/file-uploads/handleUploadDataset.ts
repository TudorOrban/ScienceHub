import { Operation } from "@/src/contexts/general/ToastsContext";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/src/services/update/updateGeneralData";
import { Dataset } from "@/src/types/workTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Function handling the upload of a Dataset file
 * Hits api endpoint, updates work submission correspondingly, handles error/loading states
 * To be moved to the backend soon.
 */

export interface HandleUploadDatasetParams {
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    dataset: Dataset;
    workSubmissionId: number;
    file: File;
    fileType: string;
    fileSubtype: string;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    refetch?: () => void;
}

export const handleUploadDataset = async ({
    updateGeneral,
    dataset,
    workSubmissionId,
    file,
    fileType,
    fileSubtype,
    setOpenUploadModal,
    setOperations,
    refetch,
}: HandleUploadDatasetParams) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileSubtype", fileSubtype);

    try {
        if (!dataset.id) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "Dataset id could not be found.",
                },
            ]);
        }

        // Send request to upload the dataset
        const response = await fetch("/api/rest/upload", {
            method: "POST",
            headers: {
                "X-FileType": fileType,
            },
            body: formData,
        });

        if (!response.ok) {
            console.error("Dataset upload failed: ", dataset.id);
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "Error uploading dataset.",
                },
            ]);
        }

        const data: { bucketFilename?: string; message: string } = await response.json();

        if (data?.bucketFilename) {
            // Update corresponding work submission, depending on whether a file location already exists in current version
            const fileRecord = !dataset.fileLocation?.bucketFilename
                ? {
                      fileToBeAdded: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: fileType,
                          file_subtype: fileSubtype,
                      },
                  }
                : {
                      fileToBeRemoved: dataset.fileLocation,
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
                    "File location update failed for dataset submission: ",
                    dataset.id,
                    workSubmissionId
                );
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage:
                            "Error while writing dataset location into work submission. Please try again or reach out for support at https://sciencehub.site/resources/contact-us",
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
                            "The dataset has been successfully updated and recorded into the selected submission.",
                    },
                ]);
                setOpenUploadModal(false);
                refetch?.();
            }
        }
    } catch (error) {
        console.error("Error uploading dataset: ", error);
    }
};
