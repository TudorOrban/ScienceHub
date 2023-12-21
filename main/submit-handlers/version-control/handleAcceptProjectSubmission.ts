import { ProjectSubmission } from "@/types/versionControlTypes";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { User } from "@/types/userTypes";
import { toSupabaseDateFormat } from "@/utils/functions";
import { Operation } from "@/contexts/general/ToastsContext";
import { ProjectLayout } from "@/types/projectTypes";
import {
    PartialProjectRecord,
    getFinalVersionProjectRecord,
} from "@/version-control-system/diff-logic/getFinalVersionProjectRecord";

// TODO: Add merge handling

interface HandleAcceptProjectSubmissionParams {
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    projectSubmission: ProjectSubmission;
    project: ProjectLayout;
    currentUser: User;
    setOperations: (operations: Operation[]) => void;
    refetchSubmission?: () => void;
    revalidateProjectPath?: (path: string) => void;
    identifier?: string;
}

export const handleAcceptProjectSubmission = async ({
    updateGeneral,
    projectSubmission,
    project,
    currentUser,
    setOperations,
    refetchSubmission,
    revalidateProjectPath,
    identifier,
}: HandleAcceptProjectSubmissionParams) => {
    const isProjectMainAuthor = project?.users
        ?.map((user) => user.id)
        .includes(currentUser.id || "");
    const isCorrectVersion =
        projectSubmission?.initialProjectVersionId === project?.currentProjectVersionId; // TODO: remove this constraint in the future
    const isAlreadyAccepted = projectSubmission?.status === "Accepted";
    const isCorrectStatus = projectSubmission?.status === "Submitted" && !isAlreadyAccepted;
    const permissions = isProjectMainAuthor && isCorrectVersion && isCorrectStatus;

    try {
        if (projectSubmission?.id && currentUser.id && currentUser.id !== "" && permissions) {
            // Apply diffs to all text/textArray fields
            const updateRecord = getFinalVersionProjectRecord(
                project,
                projectSubmission?.projectDelta || {}
            );
            // Fields to be updated
            const updateFields: PartialProjectRecord = {
                ...updateRecord,
                current_project_version_id: projectSubmission.finalProjectVersionId || 0,
            };

            // Update project with modified fields + current project version + file location if necessary
            const updatedProject = await updateGeneral.mutateAsync({
                tableName: "projects",
                identifierField: "id",
                identifier: project.id,
                updateFields: updateFields,
            });

            // Error handling
            if (updateGeneral.error || updatedProject.error) {
                console.error(
                    `An error occurred while updating the project on accept for ${project?.id}`,
                    updateGeneral.error || updatedProject.error
                );

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Project Submission",
                        customMessage: `An error occurred while updating the project.`,
                    },
                ]);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Project Submission",
                        customMessage: `Project has been successfully updated.`,
                    },
                ]);
            }

            // TODO: Submit work submissions!

            // Update submission status
            const updatedSubmission = await updateGeneral.mutateAsync({
                tableName: "project_submissions",
                identifierField: "id",
                identifier: projectSubmission.id,
                updateFields: {
                    status: "Accepted",
                    accepted_data: {
                        date: toSupabaseDateFormat(new Date().toISOString()),
                        users: [currentUser],
                    },
                },
            });

            if (updateGeneral.error || updatedSubmission.error) {
                console.error(
                    "An error occurred while updating the project submission status",
                    projectSubmission.id,
                    updateGeneral.error || updatedSubmission.error
                );
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Project Submission",
                        customMessage:
                            "An error occurred while updating the project submission status.",
                    },
                ]);
            } else {
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Project Submission",
                        customMessage: `Project Submission has been successfully accepted.`,
                    },
                ]);
                refetchSubmission?.();
                revalidateProjectPath?.(`${identifier}/projects/${project?.name}`);
            }

            // TODO: Update version graph + decide if initial version should be snapshot
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
    }
};
