import { WorkSubmission } from "@/types/versionControlTypes";
import { Work } from "@/types/workTypes";
import { Operation } from "@/components/light-simple-elements/ToastManager";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { User } from "@/types/userTypes";

export const handleAcceptWorkSubmission = (
    updateGeneral: UseMutationResult<GeneralUpdateOutput, PostgrestError, Omit<GeneralUpdateInput<unknown>, "supabase">, unknown>,
    workSubmission: WorkSubmission,
    work: Work,
    currentUser: User,
    setOperations: (operations: Operation[]) => void,
) => {
    const isWorkMainAuthor = work?.users?.map((user) => user.id).includes(currentUser.id || "");
    const isCorrectVersion = workSubmission?.initialWorkVersionId === work?.currentWorkVersionId;
    const isAlreadyAccepted = workSubmission?.status === "Accepted";
    const isCorrectStatus = workSubmission?.status === "Submitted" && !isAlreadyAccepted;
    const permissions = isWorkMainAuthor && isCorrectVersion && isCorrectStatus;

    try {
        if (workSubmission?.id && currentUser.id && currentUser.id !== "" && permissions) {
            /* 
            1. Update work with:
            - applying diffs
            - current version = final submission version
            - upload toBeAdded files
            - remove toBeRemoved files
            2. Update work version graph with:
            - 
            - decide if initial submission version should be snapshot
            */
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