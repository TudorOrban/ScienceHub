import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import computeDelta from "@/app/version-control-system/computeDelta";
import fetchLatestVersion from "../fetch/fetchLatestVersion";
import createNewVersion from "./createNewVersion";

export interface CreateSubmissionProps {
    projectId?: number;
    workIds?: number[];
    userId: string;
}

async function createSubmission(
    supabase: SupabaseClient<Database>,
    props: CreateSubmissionProps
): Promise<void> {
    const { projectId, workIds, userId } = props;

    try {
        // Insert the new submission into the Submissions table
        // Insert the new submission into the Submissions table
        const { error: insertError } = await supabase
            .from("submissions")
            .insert([{}]) // Assuming you are auto-generating IDs and timestamps in your DB
            .single();

        if (insertError) {
            throw new Error(
                `Failed to insert new submission: ${insertError.message}`
            );
        }

        const { data: newSubmission, error: fetchError } = await supabase
            .from("submissions")
            .select("*")
            .order("id", { ascending: false })
            .limit(1);

        if (!newSubmission) {
            throw new Error(
                "Failed to insert new submission: No data returned"
            );
        }
        const submissionId = newSubmission[0].id;

        // Associate the submission with a project, if applicable
        if (projectId) {
            const { error: projectError } = await supabase
                .from("project_submissions")
                .insert([{ id: submissionId, project_id: projectId }]);

            if (projectError) {
                throw new Error(
                    `Failed to associate submission with project: ${projectError.message}`
                );
            }
        }

        // Associate the submission with works, if applicable
        if (workIds) {
            const workSubmissions = workIds.map((workId) => ({
                submissionId,
                workId: workId,
            }));
            const { error: workError } = await supabase
                .from("work_submissions")
                .insert(
                    workIds.map((workId) => ({
                        id: submissionId,
                        work_id: workId,
                        // if you have initial and final version ids, you can add them here
                        // initial_work_version_id: initialVersionId,
                        // final_work_version_id: finalVersionId,
                    }))
                );

            if (workError) {
                throw new Error(
                    `Failed to associate submission with works: ${workError.message}`
                );
            }
        }
        if (userId) {
            const { error: userError } = await supabase
                .from("project_submission_users")
                .insert([
                    { project_submission_id: submissionId, user_id: userId },
                ]);

            if (userError) {
                throw new Error(
                    `Failed to associate submission with users: ${userError.message}`
                );
            }
        }

        // ... Inside createSubmission function
        if (projectId) {
            const newVersion = await createNewVersion(supabase, {
                objectType: "project",
                objectId: projectId,
                userId: userId,
            });

            const previousVersion = await fetchLatestVersion(
                supabase,
                "project",
                projectId
            );

            if (previousVersion && newVersion) {
                // Add check for newVersion being not null
                await computeDelta(supabase, {
                    versionFrom: previousVersion,
                    versionTo: newVersion,
                    objectType: "project",
                });
            }
        }
        // ...

        if (workIds) {
            for (const workId of workIds) {
                await createNewVersion(supabase, {
                    objectType: "work",
                    objectId: workId,
                    userId,
                });
            }
        }

        // ... rest of the logic for works, versions, deltas, etc.
    } catch (error) {
        console.error(
            `An error occurred while creating a new submission: ${
                (error as any).message
            }`
        );
    }
}

export default createSubmission;
