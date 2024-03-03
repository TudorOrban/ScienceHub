import { Operation } from "@/contexts/general/ToastsContext";

/**
 * Function handling the submit of a project submission.
 * Calls API endpoint to: update project submission and all associated work submissions accordingly, handles error/loading states.
 * 
 */
interface HandleSubmitProjectSubmissionParams {
    projectSubmissionId: string;
    currentUserId: string;
    permissions: boolean;
    setOperations: (operations: Operation[]) => void;
    setIsLoading?: (isLoading: boolean) => void;
    refetchSubmission?: () => void;
}

export const handleSubmitProjectSubmission = async ({
    projectSubmissionId,
    currentUserId,
    permissions,
    setOperations,
    setIsLoading,
    refetchSubmission,
}: HandleSubmitProjectSubmissionParams) => {
    try {
        if (projectSubmissionId && currentUserId && currentUserId !== "" && permissions) {
            setIsLoading?.(true);
            
            // Call endpoint
            const response = await fetch(
                `http://localhost:5183/api/v1/submissions/project-submissions/${projectSubmissionId}/submit`,
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
                console.error(`An error occurred while submitting the project`, errorData);

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Project Submission",
                        customMessage: "An error occured while submitting the project. Please try again.",
                    }
                ]);
                setIsLoading?.(false);    
                return;
            }

            // Handle success
            const newProject = await response.json();

            refetchSubmission?.();
            setIsLoading?.(false);
        } else if (!permissions) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project Submission",
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
                entityType: "Project Submission",
                customMessage: "An error occured while submitting the project. Please try again.",
            }
        ]);
        setIsLoading?.(false);
    }
};
