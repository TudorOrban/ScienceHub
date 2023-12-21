import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { User } from "@/types/userTypes";
import { SubmissionStatus } from "@/types/versionControlTypes";
import { toSupabaseDateFormat } from "@/utils/functions";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";

export const handleSubmitProjectSubmission = async (
    updateGeneral: UseMutationResult<GeneralUpdateOutput, PostgrestError, Omit<GeneralUpdateInput<unknown>, "supabase">, unknown>,
    submissionId: string,
    submissionStatus: SubmissionStatus | undefined,
    submissionUsers: User[] | undefined,
    currentUser: User,
    setOperations: (operations: Operation[]) => void,
    refetchSubmission?: () => void,
) => {
    const isAuthor = !!submissionUsers && submissionUsers?.map((user) => user.id).includes(currentUser.id || "");
    const permissions = isAuthor;
    const isAlreadySubmitted = submissionStatus === "Submitted" || submissionStatus === "Accepted";

    try {
        if (submissionId && currentUser.id && currentUser.id !== "" && permissions && !isAlreadySubmitted) {
            const updatedSubmission = await updateGeneral.mutateAsync({
                tableName: "project_submissions",
                identifierField: "id",
                identifier: submissionId,
                updateFields: {
                    status: "Submitted",
                    submitted_data: {
                        date: toSupabaseDateFormat(new Date().toISOString()),
                        users: [currentUser],
                    },
                },
            });

            setOperations([
                {
                    operationType: "update",
                    operationOutcome: updateGeneral.error || updatedSubmission.error
                        ? "error"
                        : updateGeneral.isLoading
                        ? "loading"
                        : "success",
                    entityType: "Project Submission",
                },
            ]);
            refetchSubmission?.();
        } else if (isAlreadySubmitted) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project Submission",
                    customMessage: "Submission has already been submitted.",
                },
            ]);
        } else if (!permissions) {
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project Submission",
                    customMessage: "You do not have permissions to submit.",
                },
            ]);
        }
    } catch (error) {
        console.log("An error occurred: ", error);
    }

    
};