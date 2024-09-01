import { Operation } from "@/src/contexts/general/ToastsContext";
import {
    UpdateWorkDeltaFieldsInput,
    UpdateWorkDeltaFieldsOutput,
} from "@/src/modules/version-control-system/services/updateWorkDeltaFields";
import { WorkDelta } from "@/src/types/versionControlTypes";
import { Json } from "@/types_db";
import { UseMutationResult } from "@tanstack/react-query";

/**
 * Function using stored procedure to update appropriate delta field without the need for fresh work delta.
 * handles error/loading states.
 * To be moved to the backend soon.
 */
interface SaveChangesParams {
    updateDelta: UseMutationResult<
        UpdateWorkDeltaFieldsOutput,
        Error,
        Omit<UpdateWorkDeltaFieldsInput, "supabase">,
        unknown
    >;
    selectedWorkSubmissionId: number;
    workDeltaChanges: WorkDelta;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
    setOperations: (operations: Operation[]) => void;
}

export const handleSaveWorkDeltaChangesToSubmission = async ({
    updateDelta,
    selectedWorkSubmissionId,
    workDeltaChanges,
    setWorkDeltaChanges,
    setOperations,
}: SaveChangesParams) => {
    if (
        selectedWorkSubmissionId !== 0 &&
        workDeltaChanges &&
        Object.keys(workDeltaChanges).length > 0
    ) {
        try {
            // Use stored procedure to update appropriate field without the need for fresh work delta
            await updateDelta.mutateAsync({
                submissionId: selectedWorkSubmissionId,
                deltaChanges: workDeltaChanges as Json,
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
                        customMessage: "The changes have been successfully saved.",
                    },
                ]);
                setWorkDeltaChanges({});
            }
        } catch (error) {
            console.error("An error occurred while saving: ", error);
        }
    }
};
