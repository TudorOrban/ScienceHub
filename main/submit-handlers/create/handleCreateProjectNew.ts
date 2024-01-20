import { Operation } from "@/contexts/general/ToastsContext";
import { z } from "zod";

// Form schema
export const CreateProjectSchema = z
    .object({
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
    onCreateNew: () => void;
    setOperations: (operations: Operation[]) => void;
    formData: CreateProjectFormData;
}

export const handleCreateProject = async ({
    onCreateNew,
    setOperations,
    formData,
}: HandleCreateProjectInput) => {
    try {
        const finalFormData = {
            ...formData,
            Link: "/TudorAOrban/projects/FEBE"
        }
        const response = await fetch("http://localhost:5183/api/v1/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalFormData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`An error occurred while creating the project`, errorData);

            setOperations([{
                operationType: "update",
                operationOutcome: "error",
                entityType: "Project",
                customMessage: "An error occurred while creating the project."
            }]);
            return;
        }

        const newProject = await response.json();

        setOperations([{
            operationType: "update",
            operationOutcome: "success",
            entityType: "Project",
            customMessage: "The project has been successfully created."
        }])

        onCreateNew();
    } catch (error) {
        console.log("An error occurred: ", error);
    }
};
