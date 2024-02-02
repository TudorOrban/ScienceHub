import { Operation } from "@/contexts/general/ToastsContext";
import {
    UpdateProjectDeltaFieldsInput,
    UpdateProjectDeltaFieldsOutput,
} from "@/version-control-system/services/updateProjectDeltaFields";
import { ProjectDelta } from "@/types/versionControlTypes";
import { Json } from "@/types_db";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Function using stored procedure to update appropriate delta field without the need for fresh project delta.
 * handles error/loading states.
 * To be moved to the backend soon.
 */

interface SaveChangesParams {
    updateDelta: UseMutationResult<
        UpdateProjectDeltaFieldsOutput,
        Error,
        Omit<UpdateProjectDeltaFieldsInput, "supabase">,
        unknown
    >;
    selectedProjectSubmissionId: number;
    projectDeltaChanges: ProjectDelta;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    setOperations: (operations: Operation[]) => void;
}

export const handleSaveProjectDeltaChangesToSubmission = async ({
    updateDelta,
    selectedProjectSubmissionId,
    projectDeltaChanges,
    setProjectDeltaChanges,
    setOperations,
}: SaveChangesParams) => {
    if (
        selectedProjectSubmissionId !== 0 &&
        projectDeltaChanges &&
        Object.keys(projectDeltaChanges).length > 0
    ) {
        try {
            await updateDelta.mutateAsync({
                submissionId: selectedProjectSubmissionId,
                deltaChanges: projectDeltaChanges as Json,
            });

            if (updateDelta.isError) {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Submission",
                    },
                ]);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Submission",
                        customMessage: "The changes have been saved successfully.",
                    },
                ]);
                setProjectDeltaChanges({});
            }
        } catch (error) {
            console.error("An error occurred while saving: ", error);
        }
    }
};
