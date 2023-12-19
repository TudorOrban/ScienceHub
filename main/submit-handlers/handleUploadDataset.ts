import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { WorkSubmission } from "@/types/versionControlTypes";
import { Dataset } from "@/types/workTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";

export interface HandleUploadDatasetParams {
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    dataset: Dataset;
    workSubmission: WorkSubmission;
    file: File;
    datasetType: string;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    refetch?: () => void;
}

export const handleUploadDataset = async ({
    updateGeneral,
    dataset,
    workSubmission,
    file,
    datasetType,
    setOpenUploadModal,
    setOperations,
    refetch,
}: HandleUploadDatasetParams) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("datasetType", datasetType);

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

        console.log("DSADSA", dataset.fileLocation, workSubmission.workDelta);
        if (data?.bucketFilename) {
            // Update corresponding work submission, depending on whether a file location already exists in current version
            const fileRecord = !dataset.fileLocation
                ? {
                      fileToBeAdded: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: "Dataset",
                          file_subtype: datasetType,
                      },
                  }
                : {
                      fileToBeRemoved: dataset.fileLocation,
                      fileToBeUpdated: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: "Dataset",
                          file_subtype: datasetType,
                      },
                  };

            const updatedWorkSubmission = await updateGeneral.mutateAsync({
                tableName: "work_submissions",
                identifier: workSubmission.id,
                identifierField: "id",
                updateFields: {
                    work_delta: {
                        ...workSubmission.workDelta,
                        ...fileRecord,
                    },
                },
            });

            if (updateGeneral.error || updatedWorkSubmission.error) {
                console.error(
                    "File location update failed for dataset submission: ",
                    dataset.id,
                    workSubmission.id
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
