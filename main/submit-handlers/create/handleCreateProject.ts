import { Operation } from "@/contexts/general/ToastsContext";
import { GeneralCreateInput, GeneralCreateOutput } from "@/services/create/createGeneralData";
import {
    GeneralCreateManyToManyOutput,
    GeneralManyToManyInput,
} from "@/services/create/createGeneralManyToManyEntry";
import { GeneralUpdateInput, GeneralUpdateOutput } from "@/services/update/updateGeneralData";
import { ProjectLayout } from "@/types/projectTypes";
import { PostgrestError } from "@supabase/supabase-js";
import { UseMutationResult } from "@tanstack/react-query";
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
    updateGeneral: UseMutationResult<
        GeneralUpdateOutput,
        PostgrestError,
        Omit<GeneralUpdateInput<unknown>, "supabase">,
        unknown
    >;
    onCreateNew: () => void;
    setOperations: (operations: Operation[]) => void;
    formData: CreateProjectFormData;
}

export const handleCreateProject = async ({
    createGeneral,
    createGeneralManyToMany,
    updateGeneral,
    onCreateNew,
    setOperations,
    formData,
}: HandleCreateProjectInput) => {
    try {
        const { users,  ...projectData } = formData;

        // Create project
        const newProject = await createGeneral.mutateAsync({
            tableName: "projects",
            input: { ...projectData } as Partial<ProjectLayout>,
        });

        if (createGeneral.error || newProject.error || !newProject.data) {
            console.error(
                `An error occurred while creating the project`,
                createGeneral.error || newProject.error
            );

            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project",
                    customMessage: `An error occurred while creating the project.`,
                },
            ]);

            return;
        }

        // Add project users and teams
        for (const userId of users) {
            const intermediateTableName = "project_users";
            const newProjectUser = await createGeneralManyToMany.mutateAsync({
                tableName: `${intermediateTableName}`,
                firstEntityColumnName: `project_id`,
                firstEntityId: newProject.data.id,
                secondEntityColumnName: `user_id`,
                secondEntityId: userId,
                extraInfo: {
                    role: "Main Author"
                }
            });

            if (createGeneralManyToMany.error || newProjectUser.error) {
                console.error(
                    `An error occurred while linking project and users.`,
                    createGeneralManyToMany.error || newProject.error
                );

                setOperations([
                    {
                        operationType: "update",
                        operationOutcome: "error",
                        entityType: "Project",
                        customMessage: `An error occurred while linking the project to the users.`,
                    },
                ]);

                return;
            }
        }

        // Generate an initial project version
        const newInitialVersion = await createGeneral.mutateAsync({
            tableName: "project_versions",
            input: {
                project_id: newProject.data.id,
            },
        });

        if (createGeneral.error || newInitialVersion.error || !newInitialVersion.data) {
            console.error(
                `An error occurred while creating the initial project version`,
                createGeneral.error || newInitialVersion.error
            );

            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project",
                    customMessage: `An error occurred while creating the initial project version.`,
                },
            ]);

            return;
        }

        const updatedProject = await updateGeneral.mutateAsync({
            tableName: "projects",
            identifierField: "id",
            identifier: newProject.data.id,
            updateFields: {
                current_project_version_id: newInitialVersion.data.id,
            },
        });

        if (updateGeneral.error || updatedProject.error) {
            console.error(
                `An error occurred while updating current project version id.`,
                updateGeneral.error || updatedProject.error
            );

            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Project Submission Link",
                    customMessage: `An error occurred while updating current project version ID.`,
                },
            ]);

            return;
        }

        setOperations([
            {
                operationType: "update",
                operationOutcome: "success",
                entityType: "Project",
                customMessage: `The project has been successfully created.`,
            },
        ]);
        onCreateNew();
    } catch (error) {
        console.log("An error occurred: ", error);
    }
};
