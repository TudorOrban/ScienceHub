import { Operation } from "@/src/contexts/general/ToastsContext";
import { User } from "@/src/types/userTypes";
import { constructProjectUrl } from "@/src/utils/constructObjectUrl";
import { z } from "zod";

/**
 * Function handling the submission of the Create Project form.
 * Validates form data clientside, hits backend endpoint and handles error/loading states
 */

// Form schema
export const CreateProjectSchema = z.object({
    title: z.string().min(1, { message: "Title is required." }).max(100, {
        message: "Title must be less than 100 characters long.",
    }),
    name: z.string().min(1, { message: "Name is required." }).max(100, {
        message: "Name must be less than 100 characters long.",
    }),
    description: z.string(),
    users: z.array(z.string()).min(1, { message: "At least one user is required." }),
    public: z.boolean(),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectSchema>;

interface HandleCreateProjectInput {
    onCreateNew: () => void; // For closing form on success
    setIsCreateLoading?: (setIsCreateLoading: boolean) => void; // For loading spinner
    setOperations: (operations: Operation[]) => void; // For toasts
    extraInfo?: { users: User[] }; // For configuring project link (to be moved to backend)
    formData: CreateProjectFormData; // Form data
}

export const handleCreateProject = async ({
    onCreateNew,
    setIsCreateLoading,
    setOperations,
    extraInfo,
    formData,
}: HandleCreateProjectInput) => {
    try {
        // Preliminaries
        setIsCreateLoading?.(true);
        const link = constructProjectUrl(formData.name, extraInfo?.users || [], []);
        const finalFormData = {
            ...formData,
            Link: link,
        };

        // Hit backend endpoint
        const response = await fetch("http://localhost:5183/api/v1/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalFormData),
        });

        // Handle error
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`An error occurred while creating the project`, errorData);

            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project",
                    customMessage: "An error occurred while creating the project.",
                },
            ]);
            setIsCreateLoading?.(false);
            return;
        }

        // Handle success
        const newProject = await response.json();

        setOperations([
            {
                operationType: "update",
                operationOutcome: "success",
                entityType: "Project",
                customMessage: "The project has been successfully created.",
            },
        ]);

        setIsCreateLoading?.(false);
        onCreateNew();
        // TODO: Route to new project
    } catch (error) {
        console.log("An error occurred: ", error);
    }
};
