import { Operation } from "@/src/contexts/general/ToastsContext";
import { User } from "@/src/types/userTypes";
import { z } from "zod";

/**
 * Function handling the submission of the Create Work form.
 * Validates form data clientside, hits backend endpoint and handles error/loading states
 */

// Form schema
export const CreateWorkSchema = z
    .object({
        workType: z.string().min(1, { message: "Work Type is required." }),
        projectId: z.number().optional(),
        submissionId: z.string().optional(),
        title: z.string().min(1, { message: "Title is required." }).max(100, {
            message: "Title must be less than 100 characters long.",
        }),
        description: z.string().optional(),
        users: z.array(z.string()).min(1, { message: "At least one user is required." }),
        public: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (data.projectId && !data.submissionId) {
            ctx.addIssue({
                path: ["submissionId"],
                message: "Project Submission is required when a Project is selected.",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type CreateWorkFormData = z.infer<typeof CreateWorkSchema>;

interface HandleCreateWorkInput {
    onCreateNew: () => void; // For closing form on success
    setIsCreateLoading?: (issCreateLoading: boolean) => void; // For loading spinner
    setOperations: (operations: Operation[]) => void; // For toasts
    extraInfo?: { users: User[] }; // For configuring work link (to be moved to backend)
    formData: CreateWorkFormData; // Form data
}

export const handleCreateWork = async ({
    onCreateNew,
    setIsCreateLoading,
    setOperations,
    formData,
}: HandleCreateWorkInput) => {
    try {
        // Preliminaries
        setIsCreateLoading?.(true);
        let sentProjectId = formData.projectId === 0 ? null : formData.projectId;
        const finalFormData = {
            ...formData,
            projectId: sentProjectId,
        };

        // Hit backend endpoint
        const response = await fetch("http://localhost:5183/api/v1/works", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalFormData),
        });

        // Handle error
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`An error occurred while creating the work`, errorData);

            setOperations([
                {
                    operationType: "update",
                    operationOutcome: "error",
                    entityType: "Work",
                    customMessage: "An error occurred while creating the work.",
                },
            ]);
            setIsCreateLoading?.(false);
            return;
        }

        // Handle success
        const newWork = await response.json();

        setOperations([
            {
                operationType: "update",
                operationOutcome: "success",
                entityType: "Work",
                customMessage: "The work has been successfully created.",
            },
        ]);

        setIsCreateLoading?.(false);
        onCreateNew();
        // TODO: Route to new work
    } catch (error) {
        console.log("An error occurred: ", error);
    }
};

// const { workType, users, projectId, submissionId, ...workData } = formData;

//         // For handling database names
//         const objectNames = getObjectNames({ label: workType });
//         if (!objectNames) return;

//         // Create work
//         const newWork = await createGeneral.mutateAsync({
//             tableName: objectNames?.tableName || "",
//             input: { ...workData, submitted: false, } as Partial<Work>,
//         });

//         if (createGeneral.error || newWork.error || !newWork.data) {
//             console.error(
//                 `An error occurred while creating the work`,
//                 createGeneral.error || newWork.error
//             );

//             setOperations([
//                 {
//                     operationType: "update",
//                     operationOutcome: "error",
//                     entityType: "Work",
//                     customMessage: `An error occurred while creating the work.`,
//                 },
//             ]);

//             return;
//         }

//         // Add work users and teams
//         for (const userId of users) {
//             const intermediateTableName =
//                 (objectNames.tableNameForIntermediate || "") + "_" + "users";
//             const newWorkUser = await createGeneralManyToMany.mutateAsync({
//                 tableName: `${intermediateTableName}`,
//                 firstEntityColumnName: `${objectNames.tableNameForIntermediate}_id`,
//                 firstEntityId: newWork.data.id,
//                 secondEntityColumnName: `user_id`,
//                 secondEntityId: userId,
//             });

//             if (createGeneralManyToMany.error || newWorkUser.error) {
//                 console.error(
//                     `An error occurred while linking work to the project.`,
//                     createGeneralManyToMany.error || newWork.error
//                 );

//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "error",
//                         entityType: "Project",
//                         customMessage: `An error occurred while linking the work to the project`,
//                     },
//                 ]);

//                 return;
//             }
//         }

//         // Add work to project if needed
//         if (!!projectId) {
//             const intermediateTableName = "project_" + objectNames.tableName;

//             const newProjectWork = await createGeneralManyToMany.mutateAsync({
//                 tableName: `${intermediateTableName}`,
//                 firstEntityColumnName: `${objectNames.tableNameForIntermediate}_id`,
//                 firstEntityId: newWork.data.id,
//                 secondEntityColumnName: `project_id`,
//                 secondEntityId: projectId,
//             });

//             if (createGeneralManyToMany.error || newProjectWork.error) {
//                 console.error(
//                     `An error occurred while linking work to the project.`,
//                     createGeneral.error || newWork.error
//                 );

//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "error",
//                         entityType: "Project",
//                         customMessage: `An error occurred while linking the work to the project`,
//                     },
//                 ]);

//                 return;
//             }
//         }

//         // Generate an initial work version
//         const newInitialVersion = await createGeneral.mutateAsync({
//             tableName: "work_versions",
//             input: {
//                 work_id: newWork.data.id,
//                 work_type: objectNames.label,
//             },
//         });

//         if (createGeneral.error || newInitialVersion.error || !newInitialVersion.data) {
//             console.error(
//                 `An error occurred while creating the work`,
//                 createGeneral.error || newInitialVersion.error
//             );

//             setOperations([
//                 {
//                     operationType: "update",
//                     operationOutcome: "error",
//                     entityType: "Work",
//                     customMessage: `An error occurred while creating the work version.`,
//                 },
//             ]);

//             return;
//         }

//         if (!!projectId && !!submissionId) {
//             // If project and submission are selected, generate a new version and a corresponding submission
//             const newFinalVersion = await createGeneral.mutateAsync({
//                 tableName: "work_versions",
//                 input: {
//                     work_id: newWork.data.id,
//                     work_type: objectNames.label,
//                 },
//             });

//             if (createGeneral.error || newFinalVersion.error || !newFinalVersion.data) {
//                 console.error(
//                     `An error occurred while creating the work`,
//                     createGeneral.error || newFinalVersion.error
//                 );

//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "error",
//                         entityType: "Work",
//                         customMessage: `An error occurred while creating the work submission.`,
//                     },
//                 ]);

//                 return;
//             }

//             const newWorkSubmission = await createGeneral.mutateAsync({
//                 tableName: "work_submissions",
//                 input: {
//                     work_id: newWork.data.id,
//                     work_type: objectNames.label,
//                     initial_work_version_id: newInitialVersion.data.id,
//                     final_work_version_id: newFinalVersion.data.id,
//                     title: "New work submission",
//                 },
//             });

//             if (createGeneral.error || newWorkSubmission.error || !newWorkSubmission.data) {
//                 console.error(
//                     `An error occurred while creating the work`,
//                     createGeneral.error || newWorkSubmission.error
//                 );

//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "error",
//                         entityType: "Work",
//                         customMessage: `An error occurred while creating the initial work submission.`,
//                     },
//                 ]);

//                 return;
//             }

//             // Add work submission to project submission
//             const newProjectWorkSubmission = await createGeneralManyToMany.mutateAsync({
//                 tableName: "project_work_submissions",
//                 firstEntityColumnName: "project_submission_id",
//                 firstEntityId: submissionId,
//                 secondEntityColumnName: `work_submission_id`,
//                 secondEntityId: newWorkSubmission.data.id,
//             });

//             if (createGeneralManyToMany.error || newProjectWorkSubmission.error) {
//                 console.error(
//                     `An error occurred while linking work to the project.`,
//                     createGeneral.error || newProjectWorkSubmission.error
//                 );

//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "error",
//                         entityType: "Project Submission Link",
//                         customMessage: `An error occurred while linking the work submission to the project submission.`,
//                     },
//                 ]);

//                 return;
//             }

//             // Add work submisison users and teams
//             for (const userId of users) {
//                 const newWorkSubmissionUser = await createGeneralManyToMany.mutateAsync({
//                     tableName: "work_submission_users",
//                     firstEntityColumnName: `work_submission_id`,
//                     firstEntityId: newWork.data.id,
//                     secondEntityColumnName: `user_id`,
//                     secondEntityId: userId,
//                 });

//                 if (createGeneralManyToMany.error || newWorkSubmissionUser.error) {
//                     console.error(
//                         `An error occurred while linking work submission to the project submission.`,
//                         createGeneralManyToMany.error || newWorkSubmissionUser.error
//                     );

//                     setOperations([
//                         {
//                             operationType: "update",
//                             operationOutcome: "error",
//                             entityType: "Project",
//                             customMessage: `An error occurred while adding users to the work submission`,
//                         },
//                     ]);

//                     return;
//                 }
//             }

//             setOperations([
//                 {
//                     operationType: "update",
//                     operationOutcome: "success",
//                     entityType: "Project",
//                     customMessage: `Work submission has been successfully created.`,
//                 },
//             ]);
//         }

//         const updatedWork = await updateGeneral.mutateAsync({
//             tableName: objectNames?.tableName || "",
//             identifierField: "id",
//             identifier: newWork.data.id,
//             updateFields: {
//                 current_work_version_id: newInitialVersion.data.id,
//             },
//         });

//         if (updateGeneral.error || updatedWork.error) {
//             console.error(
//                 `An error occurred while linking work to the project.`,
//                 updateGeneral.error || updatedWork.error
//             );

//             setOperations([
//                 {
//                     operationType: "update",
//                     operationOutcome: "error",
//                     entityType: "Project Submission Link",
//                     customMessage: `An error occurred while updating current work version id.`,
//                 },
//             ]);

//             return;
//         }

//         setOperations([
//             {
//                 operationType: "update",
//                 operationOutcome: "success",
//                 entityType: "Work",
//                 customMessage: `The work has been successfully created.`,
//             },
//         ]);
