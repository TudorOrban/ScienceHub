import { Operation } from "@/src/contexts/general/ToastsContext";
import { z } from "zod";

/**
 * Function handling the submission of the Create Review form.
 * Validates form data clientside, hits backend endpoint and handles error/loading states
 */

// Form validation schema
export const CreateReviewSchema = z
    .object({
        reviewObjectType: z.string().min(1, { message: "Review Object Type is required." }),
        projectId: z.number(),
        workType: z.string(),
        workId: z.number(),
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
            if (data.workId === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Work is required",
                    path: [...ctx.path, "workId"],
                });
            }
        }

        if (data.reviewObjectType === "Project" && data.projectId === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Project is required",
                path: [...ctx.path, "projectId"],
            });
        }
    });

export type CreateReviewFormData = z.infer<typeof CreateReviewSchema>;

interface HandleCreateReviewInput {
    onCreateNew: () => void;
    setIsCreateLoading?: (isCreateLoading: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    formData: CreateReviewFormData;
}

export const handleCreateReview = async ({
    onCreateNew,
    setIsCreateLoading,
    setOperations,
    formData,
}: HandleCreateReviewInput) => {
    try {
        // Preliminaries
        setIsCreateLoading?.(true);
        let sentProjectId = formData.projectId === 0 ? null : formData.projectId;
        let sentWorkId = formData.workId === 0 ? null : formData.workId;
        const finalFormData = {
            ...formData,
            projectId: sentProjectId,
            workId: sentWorkId,
            Link: "/TudorAOrban/kasd", // TODO: implement
        };

        // Hit backend endpoint
        const response = await fetch("http://localhost:5183/api/v1/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalFormData),
        });

        // Handle error
        if (!response.ok) {
            const errorData = await response.json();
            console.error("An error occurred while creating the review", errorData);
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Review",
                    customMessage: `An error occurred while creating the review.`,
                },
            ]);
            setIsCreateLoading?.(false);
            return;
        }

        // Handle success
        const newReview = await response.json();

        setOperations([
            {
                operationType: "update",
                operationOutcome: "success",
                entityType: "Review",
                customMessage: `The review has been successfully created.`,
            },
        ]);

        setIsCreateLoading?.(false);
        onCreateNew();
        // TODO: Route to the new review
    } catch (error) {
        console.error("An error occurred while creating the review", error);
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Review",
                customMessage: `An error occurred while creating the review.`,
            },
        ]);
        setIsCreateLoading?.(false);
    }
};
