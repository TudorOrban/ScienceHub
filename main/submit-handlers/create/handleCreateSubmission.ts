import { Operation } from "@/contexts/general/ToastsContext";
import { z } from "zod";

// Form schema
export const CreateSubmissionSchema = z
    .object({
        submissionObjectType: z.string().min(1, { message: "Submission Object Type is required." }),
        projectId: z.number(),
        workType: z.string(),
        workId: z.number(),
        projectSubmissionId: z.number(),
        title: z.string().min(1, { message: "Title is required." }).max(100, {
            message: "Title must be less than 100 characters long.",
        }),
        description: z.string(),
        initialProjectVersionId: z.number(),
        initialWorkVersionId: z.number(),
        users: z.array(z.string()).min(1, { message: "At least one user is required." }),
        public: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (data.submissionObjectType === "Work") {
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
            if (!data.initialWorkVersionId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Initial Work Version is required",
                    path: [...ctx.path, "initialWorkVersionId"],
                });
            }
        }

        if (data.submissionObjectType === "Project") {
            if (!data.projectId || data.projectId === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Project is required",
                    path: [...ctx.path, "projectId"],
                });
            }

            if (!data.initialProjectVersionId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Initial Project Version is required",
                    path: [...ctx.path, "initialProjectVersionId"],
                });
            }
        }
    });

export type CreateSubmissionFormData = z.infer<typeof CreateSubmissionSchema>;

interface HandleCreateSubmissionInput {
    onCreateNew: () => void;
    setIsCreateLoading?: (isCreateLoading: boolean) => void;
    setOperations: (operations: Operation[]) => void;
    formData: CreateSubmissionFormData;
}

export const handleCreateSubmission = async ({
    onCreateNew,
    setIsCreateLoading,
    setOperations,
    formData,
}: HandleCreateSubmissionInput) => {
    try {
        // Preliminaries
    setIsCreateLoading?.(true);
    let sentProjectId = formData.projectId === 0 ? null : formData.projectId;
    let sentWorkId = formData.workId === 0 ? null : formData.workId;
    let sentProjectSubmissionId =
        formData.projectSubmissionId === 0 ? null : formData.projectSubmissionId;
    let sentInitialProjectVersionId =
        formData.initialProjectVersionId === 0 ? null : formData.initialProjectVersionId;
    let sentInitialWorkVersionId =
        formData.initialWorkVersionId === 0 ? null : formData.initialWorkVersionId;
    const finalFormData = {
        ...formData,
        projectId: sentProjectId,
        workId: sentWorkId,
        projectSubmissionId: sentProjectSubmissionId,
        initialProjectVersionId: sentInitialProjectVersionId,
        initialWorkVersionId: sentInitialWorkVersionId,
        Link: "/TudorAOrban/kasd",// TODO: implement
    }

    // Call endpoint
    const response = await fetch("http://localhost:5183/api/v1/submissions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
    });

    // Handle error
    if (!response.ok) {
        const errorData = await response.json();
        console.error("An error occurred while creating the submission", errorData);
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Submission",
                customMessage: `An error occurred while creating the submission.`,
            },
        ]);
        setIsCreateLoading?.(false);
        return;
    }

    // Handle success
    const newSubmission = await response.json();

    setOperations([
        {
            operationType: "update",
            operationOutcome: "success",
            entityType: "Submission",
            customMessage: `The submission has been successfully created.`,
        },
    ]);

    setIsCreateLoading?.(false);
    onCreateNew();
    } catch (error) {
        console.error("An error occurred while creating the submission", error);
        setOperations([
            {
                operationType: "update",
                operationOutcome: "error",
                entityType: "Submission",
                customMessage: `An error occurred while creating the submission.`,
            },
        ]);
        setIsCreateLoading?.(false);
    }
};

// try {
//     const {
//         submissionObjectType,
//         projectId,
//         workType,
//         workId,
//         projectSubmissionId,
//         initial_project_version_id,
//         final_project_version_id,
//         initial_work_version_id,
//         final_work_version_id,
//         users,
//         ...submissionData
//     } = formData;

//     switch (submissionObjectType) {
//         case "Project":
//             if (!!projectId) {
//                 // Generate final version
//                 const newVersion = await createGeneral.mutateAsync({
//                     tableName: "project_versions",
//                     input: {
//                         project_id: projectId,
//                     },
//                 });

//                 if (createGeneral.error || newVersion.error || !newVersion.data) {
//                     console.error(
//                         `An error occurred while creating a new project version.`,
//                         createGeneral.error || newVersion.error
//                     );

//                     setOperations([
//                         {
//                             operationType: "update",
//                             operationOutcome: "error",
//                             entityType: "Work",
//                             customMessage: `An error occurred while creating a new project version.`,
//                         },
//                     ]);

//                     return;
//                 }

//                 // Create submission
//                 const newSubmission = await createGeneral.mutateAsync({
//                     tableName: "project_submissions",
//                     input: {
//                         project_id: projectId,
//                         initial_project_version_id: initial_project_version_id,
//                         final_project_version_id: newVersion.data?.id,
//                         ...submissionData,
//                     },
//                 });

//                 if (createGeneral.error || newVersion.error || !newSubmission.data) {
//                     console.error(
//                         `An error occurred while creating the new project submission.`,
//                         createGeneral.error || newVersion.error
//                     );

//                     setOperations([
//                         {
//                             operationType: "update",
//                             operationOutcome: "error",
//                             entityType: "Work",
//                             customMessage: `An error occurred while creating the new project submission.`,
//                         },
//                     ]);

//                     return;
//                 }

//                 // Create corresponding users
//                 for (const userId of users) {
//                     const newSubmissionUser = await createGeneralManyToMany.mutateAsync({
//                         tableName: "project_submission_users",
//                         firstEntityColumnName: "project_submission_id",
//                         firstEntityId: newSubmission.data.id,
//                         secondEntityColumnName: "user_id",
//                         secondEntityId: userId,
//                     });

//                     if (
//                         createGeneral.error ||
//                         newSubmissionUser.error ||
//                         !newSubmissionUser.data
//                     ) {
//                         console.error(
//                             `An error occurred while creating the new project submission.`,
//                             createGeneral.error || newSubmissionUser.error
//                         );

//                         setOperations([
//                             {
//                                 operationType: "update",
//                                 operationOutcome: "error",
//                                 entityType: "Work",
//                                 customMessage: `An error occurred while creating the new project submission.`,
//                             },
//                         ]);

//                         return;
//                     }
//                 }
//                 // Success
//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "success",
//                         entityType: "Work",
//                         customMessage: `The project submission has been successfully created.`,
//                     },
//                 ]);

//                 // Update project version graph, no toast
//                 const updatedGraph = updateProjectGraph(
//                     projectGraph || {
//                         id: 0,
//                         projectId: projectId || "",
//                         graphData: {},
//                     },
//                     initial_project_version_id.toString(),
//                     (newVersion?.data?.id || "").toString()
//                 );

//                 const updatedVersionGraph = await updateGeneral.mutateAsync({
//                     tableName: "project_versions_graphs",
//                     identifierField: "id",
//                     identifier: projectGraph?.id || 0,
//                     updateFields: {
//                         id: projectGraph.id,
//                         project_id: projectGraph?.projectId || 0,
//                         graph_data: updatedGraph?.graphData || {},
//                     },
//                 });

//                 if (createGeneral.error || updatedVersionGraph.error) {
//                     console.error(
//                         `An error occurred while updating the project version graph.`,
//                         createGeneral.error || updatedVersionGraph.error
//                     );

//                     return;
//                 }
//             }
//             break;

//         case "Work":
//             if (!!workId) {
//                 // Generate final version
//                 const newVersion = await createGeneral.mutateAsync({
//                     tableName: "work_versions",
//                     input: {
//                         work_type: workType,
//                         work_id: workId,
//                     },
//                 });

//                 if (createGeneral.error || newVersion.error || !newVersion.data) {
//                     console.error(
//                         `An error occurred while creating a new work version.`,
//                         createGeneral.error || newVersion.error
//                     );

//                     setOperations([
//                         {
//                             operationType: "update",
//                             operationOutcome: "error",
//                             entityType: "Work",
//                             customMessage: `An error occurred while creating a new work version.`,
//                         },
//                     ]);

//                     return;
//                 }

//                 // Create submission
//                 const newSubmission = await createGeneral.mutateAsync({
//                     tableName: "work_submissions",
//                     input: {
//                         work_id: workId,
//                         work_type: workType,
//                         initial_work_version_id: initial_work_version_id,
//                         final_work_version_id: newVersion.data.id,
//                         ...submissionData,
//                     },
//                 });

//                 if (createGeneral.error || newSubmission.error || !newSubmission.data) {
//                     console.error(
//                         `An error occurred while creating the new work submission.`,
//                         createGeneral.error || newSubmission.error
//                     );

//                     setOperations([
//                         {
//                             operationType: "update",
//                             operationOutcome: "error",
//                             entityType: "Work",
//                             customMessage: `An error occurred while creating the new work submission.`,
//                         },
//                     ]);

//                     return;
//                 }

//                 // Link project submission to work submission
//                 console.log("PROJECT SUBMISSION ID: ", projectSubmissionId);
//                 if (projectSubmissionId) {
//                     const newWorkProjectSubmission = await createGeneralManyToMany.mutateAsync({
//                         tableName: "project_work_submissions",
//                         firstEntityColumnName: "work_submission_id",
//                         firstEntityId: newSubmission.data.id,
//                         secondEntityColumnName: "project_submission_id",
//                         secondEntityId: projectSubmissionId,
//                     });
//                     if (
//                         createGeneralManyToMany.error ||
//                         newWorkProjectSubmission.error ||
//                         !newWorkProjectSubmission.data
//                     ) {
//                         console.error(
//                             `An error occurred while linking project submission to work submission.`,
//                             createGeneral.error || newWorkProjectSubmission.error
//                         );

//                         setOperations([
//                             {
//                                 operationType: "update",
//                                 operationOutcome: "error",
//                                 entityType: "Work",
//                                 customMessage: `An error occurred while linking project submission to work submission.`,
//                             },
//                         ]);

//                         return;
//                     }
//                 }

//                 // Create corresponding users
//                 for (const userId of users) {
//                     const newSubmissionUser = await createGeneralManyToMany.mutateAsync({
//                         tableName: "work_submission_users",
//                         firstEntityColumnName: "work_submission_id",
//                         firstEntityId: newSubmission.data.id,
//                         secondEntityColumnName: "user_id",
//                         secondEntityId: userId,
//                     });
//                     if (
//                         createGeneral.error ||
//                         newSubmissionUser.error ||
//                         !newSubmissionUser.data
//                     ) {
//                         console.error(
//                             `An error occurred while creating the new project submission.`,
//                             createGeneral.error || newSubmissionUser.error
//                         );

//                         setOperations([
//                             {
//                                 operationType: "update",
//                                 operationOutcome: "error",
//                                 entityType: "Work",
//                                 customMessage: `An error occurred while creating the new project submission.`,
//                             },
//                         ]);

//                         return;
//                     }
//                 }

//                 // Success
//                 setOperations([
//                     {
//                         operationType: "update",
//                         operationOutcome: "success",
//                         entityType: "Work",
//                         customMessage: `The project submission has been successfully created.`,
//                     },
//                 ]);
//             }
//             break;
//     }

//     // Close modal
//     onCreateNew();
// } catch (error) {
//     console.log("An error occured: ", error);
// }

// // Project graph update operation
// const updateProjectGraph = (
//     projectGraph: ProjectGraph,
//     initialVersionId: string,
//     finalVersionId: string
// ): ProjectGraph => {
//     // Clone the existing graph
//     const updatedGraph: ProjectGraph = JSON.parse(JSON.stringify(projectGraph));

//     // Update the initial version's neighbors to include the new final version
//     if (updatedGraph.graphData[initialVersionId]) {
//         updatedGraph.graphData[initialVersionId].neighbors.push(finalVersionId);
//     } else {
//         updatedGraph.graphData[initialVersionId] = {
//             neighbors: [finalVersionId],
//         };
//     }

//     // Add the new version node with the initial version as its neighbor
//     updatedGraph.graphData[finalVersionId] = {
//         neighbors: [initialVersionId],
//         isSnapshot: false,
//     };

//     return updatedGraph;
// };
