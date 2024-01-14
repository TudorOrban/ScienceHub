import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralCreateInput, GeneralCreateOutput } from "@/services/create/createGeneralData";
import {
    GeneralCreateManyToManyOutput,
    GeneralManyToManyInput,
} from "@/services/create/createGeneralManyToManyEntry";
import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";
import { ProjectIssue, WorkIssue } from "@/types/managementTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { z } from "zod";

// Form validation schema
export const CreateIssueSchema = z
    .object({
        issueObjectType: z.string().min(1, { message: "Issue Object Type is required." }),
        projectId: z.string(),
        workType: z.string(),
        workId: z.string(),
        title: z.string().min(1, { message: "Title is required." }).max(100, {
            message: "Title must be less than 100 characters long.",
        }),
        description: z.string(),
        users: z.array(z.string()).min(1, { message: "At least one user is required." }),
        public: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (data.issueObjectType === "Work") {
            if (!data.workType) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Work Type is required",
                    path: [...ctx.path, "workType"],
                });
            }
            if (!data.workId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Work is required",
                    path: [...ctx.path, "workId"],
                });
            }
        }

        if (data.issueObjectType === "Project" && !data.projectId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Project is required",
                path: [...ctx.path, "projectId"],
            });
        }
    });

export type CreateIssueFormData = z.infer<typeof CreateIssueSchema>;

interface HandleCreateIssueInput {
    createGeneral: UseMutationResult<
        GeneralCreateOutput,
        PostgrestError,
        Omit<GeneralCreateInput<unknown>, "supabase">,
        unknown
    >;
    createGeneralManyToMany: UseMutationResult<
        GeneralCreateManyToManyOutput,
        PostgrestError,
        Omit<GeneralManyToManyInput, "supabase">,
        unknown
    >;
    onCreateNew: () => void;
    setOperations: (operations: Operation[]) => void;
    formData: CreateIssueFormData;
}

export const handleCreateIssue = async ({
    createGeneral,
    createGeneralManyToMany,
    onCreateNew,
    setOperations,
    formData,
}: HandleCreateIssueInput) => {
    try {
        const { issueObjectType, projectId, workType, workId, users, ...issueData } = formData;

        switch (issueObjectType) {
            case "Project":
                if (!projectId) {
                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Project Issue",
                            customMessage: `An error occurred: project ID is not defined.`,
                        },
                    ]);
                    return;
                }

                const issueCreationData: Partial<SnakeCaseObject<ProjectIssue>> = {
                    project_id: Number(projectId),
                    title: formData.title,
                    description: formData.description,
                    public: formData.public,
                };

                // Create Issue
                const newIssue = await createGeneral.mutateAsync({
                    tableName: "project_issues",
                    input: issueCreationData,
                });

                if (createGeneral.error || newIssue.error || !newIssue.data) {
                    console.error(
                        `An error occurred while creating a new project issue.`,
                        createGeneral.error || newIssue.error
                    );

                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Project Issue",
                            customMessage: `An error occurred while creating the new project issue.`,
                        },
                    ]);

                    return;
                }

                // Create corresponding users
                for (const userId of users) {
                    const newIssueUser = await createGeneralManyToMany.mutateAsync({
                        tableName: "project_issue_users",
                        firstEntityColumnName: "project_issue_id",
                        firstEntityId: newIssue.data.id,
                        secondEntityColumnName: "user_id",
                        secondEntityId: userId,
                    });

                    if (createGeneral.error || newIssueUser.error || !newIssueUser.data) {
                        console.error(
                            `An error occurred while creating the new project issue.`,
                            createGeneral.error || newIssueUser.error
                        );

                        setOperations([
                            {
                                operationType: "update",
                                operationOutcome: "error",
                                entityType: "Project Issue",
                                customMessage: `An error occurred while adding the users to the new project issue.`,
                            },
                        ]);

                        return;
                    }
                }

                // Success
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Project Issue",
                        customMessage: `The project issue has been successfully created.`,
                    },
                ]);
                break;
            case "Work":
                if (!workId) {
                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Work Issue",
                            customMessage: `An error occurred: work ID is not defined.`,
                        },
                    ]);
                    return;
                }

                const workIssueCreationData: Partial<SnakeCaseObject<WorkIssue>> = {
                    work_type: workType,
                    work_id: Number(workId),
                    title: formData.title,
                    description: formData.description,
                    public: formData.public,
                };

                // Create Issue
                const newWorkIssue = await createGeneral.mutateAsync({
                    tableName: "work_issues",
                    input: workIssueCreationData,
                });

                if (createGeneral.error || newWorkIssue.error || !newWorkIssue.data) {
                    console.error(
                        `An error occurred while creating a new work issue.`,
                        createGeneral.error || newWorkIssue.error
                    );

                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Work Issue",
                            customMessage: `An error occurred while creating the new work issue.`,
                        },
                    ]);

                    return;
                }

                // Create corresponding users
                for (const userId of users) {
                    const newIssueUser = await createGeneralManyToMany.mutateAsync({
                        tableName: "work_issue_users",
                        firstEntityColumnName: "work_issue_id",
                        firstEntityId: newWorkIssue.data.id,
                        secondEntityColumnName: "user_id",
                        secondEntityId: userId,
                    });

                    if (createGeneral.error || newIssueUser.error || !newIssueUser.data) {
                        console.error(
                            `An error occurred while creating the new work issue.`,
                            createGeneral.error || newIssueUser.error
                        );

                        setOperations([
                            {
                                operationType: "update",
                                operationOutcome: "error",
                                entityType: "Work Issue",
                                customMessage: `An error occurred while adding the users to the new work issue.`,
                            },
                        ]);
                        
                        return;
                    }
                }

                // Success
                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "success",
                        entityType: "Work Issue",
                        customMessage: `The work issue has been successfully created.`,
                    },
                ]);
                break;
        }

        // Close modal
        onCreateNew();
    } catch (error) {
        console.log("An error occured: ", error);
    }
};
