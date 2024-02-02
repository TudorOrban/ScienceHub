import { Operation } from "@/contexts/general/ToastsContext";
import { z } from "zod";

/**
 * Function handling the submission of the Create Issue form.
 * Validates form data clientside, hits backend endpoint and handles error/loading states
 */

// Form validation schema
export const CreateIssueSchema = z
    .object({
        issueObjectType: z.string().min(1, { message: "Issue Object Type is required." }),
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
        if (data.issueObjectType === "Work") {
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

        if (data.issueObjectType === "Project" && data.projectId === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Project is required",
                path: [...ctx.path, "projectId"],
            });
        }
    });

export type CreateIssueFormData = z.infer<typeof CreateIssueSchema>;

interface HandleCreateIssueInput {
    onCreateNew: () => void;
    setIsCreateLoading?: (isCreateLoading: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    formData: CreateIssueFormData;
}

export const handleCreateIssue = async ({
    onCreateNew,
    setIsCreateLoading,
    setOperations,
    formData,
}: HandleCreateIssueInput) => {
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
        const response = await fetch("http://localhost:5183/api/v1/issues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalFormData),
        });

        // Handle error
        if (!response.ok) {
            const errorData = await response.json();
            console.error("An error occurred while creating the issue", errorData);
            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Issue",
                    customMessage: `An error occurred while creating the issue.`,
                },
            ]);
            setIsCreateLoading?.(false);
            return;
        }

        // Handle success
        const newIssue = await response.json();

        setOperations([
            {
                operationType: "update",
                operationOutcome: "success",
                entityType: "Issue",
                customMessage: `The issue has been successfully created.`,
            },
        ]);

        setIsCreateLoading?.(false);
        onCreateNew();
        // TODO: Route to the new issue
    } catch (error) {
        console.error("An error occurred while creating the issue", error);
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Issue",
                customMessage: `An error occurred while creating the issue.`,
            },
        ]);
        setIsCreateLoading?.(false);
    }
};
