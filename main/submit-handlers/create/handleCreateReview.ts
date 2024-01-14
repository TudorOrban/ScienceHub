import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralCreateInput, GeneralCreateOutput } from "@/services/create/createGeneralData";
import {
    GeneralCreateManyToManyOutput,
    GeneralManyToManyInput,
} from "@/services/create/createGeneralManyToManyEntry";
import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";
import { ProjectReview, WorkReview } from "@/types/managementTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
import { z } from "zod";

// Form validation schema
export const CreateReviewSchema = z
    .object({
        reviewObjectType: z.string().min(1, { message: "Review Object Type is required." }),
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
        if (data.reviewObjectType === "Work") {
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

        if (data.reviewObjectType === "Project" && !data.projectId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Project is required",
                path: [...ctx.path, "projectId"],
            });
        }
    });

export type CreateReviewFormData = z.infer<typeof CreateReviewSchema>;

interface HandleCreateReviewInput {
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
    formData: CreateReviewFormData;
}

export const handleCreateReview = async ({
    createGeneral,
    createGeneralManyToMany,
    onCreateNew,
    setOperations,
    formData,
}: HandleCreateReviewInput) => {
    try {
        const { reviewObjectType, projectId, workType, workId, users, ...reviewData } = formData;

        switch (reviewObjectType) {
            case "Project":
                if (!projectId) {
                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Project Review",
                            customMessage: `An error occurred: project ID is not defined.`,
                        },
                    ]);
                    return;
                }

                const reviewCreationData: Partial<SnakeCaseObject<ProjectReview>> = {
                    review_type: "Community Review",
                    project_id: Number(projectId),
                    title: formData.title,
                    description: formData.description,
                    public: formData.public,
                };

                // Create Review
                const newReview = await createGeneral.mutateAsync({
                    tableName: "project_reviews",
                    input: reviewCreationData,
                });

                if (createGeneral.error || newReview.error || !newReview.data) {
                    console.error(
                        `An error occurred while creating a new project review.`,
                        createGeneral.error || newReview.error
                    );

                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Project Review",
                            customMessage: `An error occurred while creating the new project review.`,
                        },
                    ]);

                    return;
                }

                // Create corresponding users
                for (const userId of users) {
                    const newReviewUser = await createGeneralManyToMany.mutateAsync({
                        tableName: "project_review_users",
                        firstEntityColumnName: "project_review_id",
                        firstEntityId: newReview.data.id,
                        secondEntityColumnName: "user_id",
                        secondEntityId: userId,
                    });

                    if (createGeneral.error || newReviewUser.error || !newReviewUser.data) {
                        console.error(
                            `An error occurred while creating the new project review.`,
                            createGeneral.error || newReviewUser.error
                        );

                        setOperations([
                            {
                                operationType: "update",
                                operationOutcome: "error",
                                entityType: "Project Review",
                                customMessage: `An error occurred while adding the users to the new project review.`,
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
                        entityType: "Project Review",
                        customMessage: `The project review has been successfully created.`,
                    },
                ]);
                break;
            case "Work":
                if (!workId) {
                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Work Review",
                            customMessage: `An error occurred: work ID is not defined.`,
                        },
                    ]);
                    return;
                }

                const workReviewCreationData: Partial<SnakeCaseObject<WorkReview>> = {
                    review_type: "Community Review",
                    work_type: workType,
                    work_id: Number(workId),
                    title: formData.title,
                    description: formData.description,
                    public: formData.public,
                };

                // Create Review
                const newWorkReview = await createGeneral.mutateAsync({
                    tableName: "work_reviews",
                    input: workReviewCreationData,
                });

                if (createGeneral.error || newWorkReview.error || !newWorkReview.data) {
                    console.error(
                        `An error occurred while creating a new work review.`,
                        createGeneral.error || newWorkReview.error
                    );

                    setOperations([
                        {
                            operationType: "update",
                            operationOutcome: "error",
                            entityType: "Work Review",
                            customMessage: `An error occurred while creating the new work review.`,
                        },
                    ]);

                    return;
                }

                // Create corresponding users
                for (const userId of users) {
                    const newReviewUser = await createGeneralManyToMany.mutateAsync({
                        tableName: "work_review_users",
                        firstEntityColumnName: "work_review_id",
                        firstEntityId: newWorkReview.data.id,
                        secondEntityColumnName: "user_id",
                        secondEntityId: userId,
                    });

                    if (createGeneral.error || newReviewUser.error || !newReviewUser.data) {
                        console.error(
                            `An error occurred while creating the new work review.`,
                            createGeneral.error || newReviewUser.error
                        );

                        setOperations([
                            {
                                operationType: "update",
                                operationOutcome: "error",
                                entityType: "Work Review",
                                customMessage: `An error occurred while adding the users to the new work review.`,
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
                        entityType: "Work Review",
                        customMessage: `The work review has been successfully created.`,
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
