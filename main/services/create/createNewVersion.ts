import { ProjectVersion, WorkVersion } from "@/types/versionControlTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

type Version = ProjectVersion | WorkVersion;

interface CreateNewVersionProps {
    objectType: "project" | "work";
    objectId: number;
    userId: string;
}

async function createNewVersion(
    supabase: SupabaseClient<Database>,
    props: CreateNewVersionProps
): Promise<ProjectVersion | WorkVersion | null> {
    const { objectType, objectId, userId } = props;

    try {
        let versionTable: string;
        let objectTable: string;
        let foreignKeyColumn: string;
        let versionInsertData: Partial<ProjectVersion> | Partial<WorkVersion>;

        if (objectType === "project") {
            versionTable = "project_versions";
            objectTable = "projects";
            foreignKeyColumn = "project_id";
            versionInsertData = {
                [foreignKeyColumn]: objectId,
                version_number: 0,
            } as Partial<ProjectVersion>;
        } else {
            versionTable = "work_versions";
            objectTable = "works"; 
            foreignKeyColumn = "experiment_id"; 
            versionInsertData = {
                [foreignKeyColumn]: objectId,
                version_number: 0,
            } as Partial<WorkVersion>;
        }

        const { data: versionData, error: versionError } = await supabase
            .from(versionTable)
            .select("version_number")
            .eq(foreignKeyColumn, objectId)
            .order("version_number", { ascending: false })
            .limit(1);

        if (versionError) {
            throw new Error(
                `Failed to fetch the latest version: ${versionError.message}`
            );
        }

        const latestVersionNumber = versionData?.[0]?.version_number || 0;
        const newVersionNumber = latestVersionNumber + 1;

        const insertData = {
            [foreignKeyColumn]: objectId,
            version_number: newVersionNumber,
        };
        const { data: insertedVersion, error: insertError } = await supabase
            .from(versionTable)
            .insert([insertData] as any);

        if (insertError) {
            console.log("Insert error details:", insertError);
            throw new Error(
                `Failed to insert new version: ${insertError.message}`
            );
        }

        if (!insertedVersion) {
            throw new Error("Failed to insert new version.");
        }
        const newVersionId = (
            insertedVersion as Array<ProjectVersion | WorkVersion>
        )[0]?.id;

        if (userId && newVersionId) {
            const { error: userError } = await supabase
                .from("project_version_users")
                .insert([
                    { project_version_id: newVersionId, user_id: userId },
                ]);

            if (userError) {
                throw new Error(
                    `Failed to associate version with users: ${userError.message}`
                );
            }
        }

        const { error: updateError } = await supabase
            .from(objectTable)
            .update({ current_version: newVersionNumber })
            .eq("id", objectId);

        if (updateError) {
            throw new Error(
                `Failed to update current version: ${updateError.message}`
            );
        }

        const newVersion = {
            id: 0, 
            versionNumber: newVersionNumber,
            createdAt: new Date().toISOString(),
        };

        if (objectType === "project") {
            return {
                ...newVersion,
                projectId: objectId,
            } as ProjectVersion;
        } else {
            return {
                ...newVersion,
                workType: "experiment",
                workId: objectId,
            } as WorkVersion;
        }
    } catch (error) {
        console.error(
            `An error occurred while creating a new version: ${
                (error as any).message
            }`
        );
        return null;
    }
}

export default createNewVersion;
