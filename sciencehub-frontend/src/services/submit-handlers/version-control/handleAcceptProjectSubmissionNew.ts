import { Operation } from "@/src/contexts/general/ToastsContext";

/**
 * Function handling the accept of a project submission.
 * Calls API endpoint to: merge project delta into project, apply accept for all associated work submissions,
 * Update project submission correspondingly, handles error/loading states.
 */
interface HandleAcceptProjectSubmissionParams {
    projectSubmissionId: number;
    currentUserId: string;
    permissions: boolean;
    isAlreadyAccepted: boolean;
    setOperations: (operations: Operation[]) => void;
    setIsLoading?: (isLoading: boolean) => void;
    refetchSubmission?: () => void;
    revalidateProjectPath?: (path: string) => void;
}

export const handleAcceptProjectSubmission = async ({
    projectSubmissionId,
    currentUserId,
    permissions,
    isAlreadyAccepted,
    setOperations,
    setIsLoading,
    refetchSubmission,
    revalidateProjectPath,
}: HandleAcceptProjectSubmissionParams) => {
    try {
        if (projectSubmissionId && currentUserId && currentUserId !== "" && permissions) {
            setIsLoading?.(true);
            
            // Call endpoint
            const response = await fetch(
                `http://localhost:5183/api/v1/submissions/project-submissions/${projectSubmissionId}/accept`,
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
                console.error(`An error occurred while creating the project`, errorData);

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Project Submission",
                        customMessage: "An error occurred while accepting the Project Submission. Please try again.",
                    },
                ]);
                setIsLoading?.(false);
                return;
            }

            // Handle success
            const newProject = await response.json();

            refetchSubmission?.();
            revalidateProjectPath?.(
                newProject.link // TODO: Create link on the backend
            );
            
            setIsLoading?.(false);
        } else if (isAlreadyAccepted) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project Submission",
                    customMessage: "Submission has already been accepted.",
                },
            ]);
        } else if (!permissions) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project Submission",
                    customMessage: "You do not have permissions to accept the submission.",
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
                customMessage: "An error occured while accepting the project. Please try again.",
            }
        ]);
        setIsLoading?.(false);
    }
};
