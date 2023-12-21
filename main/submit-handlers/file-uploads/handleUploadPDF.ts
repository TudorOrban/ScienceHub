import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { Work } from "@/types/workTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";

export interface HandleUploadPDFParams {
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    work: Work;
    workSubmissionId: number;
    file: File;
    fileType: string;
    setOpenUploadModal: (openUploadModal: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    refetch?: () => void;
}

export const handleUploadPDF = async ({
    updateGeneral,
    work,
    workSubmissionId,
    file,
    fileType,
    setOpenUploadModal,
    setOperations,
    refetch,
}: HandleUploadPDFParams) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        if (!work.id) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "Work id could not be found.",
                },
            ]);
        }

        // Send request to upload the pdf
        const response = await fetch("/api/rest/upload", {
            method: "POST",
            headers: {
                "X-FileType": fileType,
                "X-checkFileSubtype": "false",
            },
            body: formData,
        });

        if (!response.ok) {
            console.error("Work upload failed: ", work.id, work.workType);
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "Error uploading work.",
                },
            ]);
        }

        const data: { bucketFilename?: string; message: string } = await response.json();

        if (data?.bucketFilename) {
            // Update corresponding work submission, depending on whether a file location already exists in current version
            const fileRecord = !work.fileLocation?.bucketFilename
                ? {
                      fileToBeAdded: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: fileType,
                      },
                  }
                : {
                      fileToBeRemoved: work.fileLocation,
                      fileToBeUpdated: {
                          filename: file.name,
                          bucket_filename: data?.bucketFilename,
                          file_type: fileType,
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
                    "File location update failed for work submission: ",
                    work.id,
                    workSubmissionId
                );
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage:
                            "Error while writing work location into work submission. Please try again or reach out for support at https://sciencehub.site/resources/contact-us",
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
                            "The work has been successfully updated and recorded into the selected submission.",
                    },
                ]);
                setOpenUploadModal(false);
                refetch?.();
            }
        }
    } catch (error) {
        console.error("Error uploading work: ", error);
    }
};
