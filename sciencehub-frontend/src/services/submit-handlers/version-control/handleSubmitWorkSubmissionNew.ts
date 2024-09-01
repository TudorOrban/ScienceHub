import { Operation } from "@/src/contexts/general/ToastsContext";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/src/services/update/updateGeneralData";
import { User } from "@/src/types/userTypes";
import { SubmissionStatus } from "@/src/types/versionControlTypes";
import { toSupabaseDateFormat } from "@/src/utils/functions";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Function handling the submit of a work submission.
 * Calls API endpoint to update work submission and work accordingly, handles error/loading states.
 * 
 */
interface HandleSubmitWorkSubmissionParams {
    workSubmissionId: string;
    currentUserId: string;
    permissions: boolean;
    setOperations: (operations: Operation[]) => void;
    setIsLoading?: (isLoading: boolean) => void;
    refetchSubmission?: () => void;
}

export const handleSubmitWorkSubmission = async ({
    workSubmissionId,
    currentUserId,
    permissions,
    setOperations,
    setIsLoading,
    refetchSubmission,
}: HandleSubmitWorkSubmissionParams) => {
    try {
        if (workSubmissionId && currentUserId && currentUserId !== "" && permissions) {
            setIsLoading?.(true);

            // Call endpoint
            const response = await fetch(
                `http://localhost:5183/api/v1/submissions/work-submissions/${workSubmissionId}/submit`,
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
                console.error(`An error occurred while submitting the work`, errorData);

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Work Submission",
                        customMessage: "An error occured while submitting the work. Please try again.",
                    }
                ]);
                setIsLoading?.(false);
                return;
            }

            // Handle success
            const newWork = await response.json();

            refetchSubmission?.();
            setIsLoading?.(false);
        } else if (!permissions) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work Submission",
                    customMessage: "You do not have permissions to submit the submission.",
                },
            ]);
        }
    } catch (error) {
        console.log("An error occurred: ", error);
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Work Submission",
                customMessage: "An error occured while submitting the work. Please try again.",
            }
        ]);
        setIsLoading?.(false);
    }
};
