import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import deepCompare from "./deepCompare";
import { ProjectVersion, WorkVersion } from "@/types/versionControlTypes";

export type DeltaAction = "added" | "removed" | "modified";
// export type DeltaData = Record<string, { action: DeltaAction; value: any }>;
export type DeltaValue = { action: DeltaAction; value: any };

export type DeltaData = Record<string, DeltaValue>;


interface ComputeDeltaProps {
    versionFrom: ProjectVersion | WorkVersion;
    versionTo: ProjectVersion | WorkVersion;
    objectType: "project" | "work";
}

async function computeDelta(
    supabase: SupabaseClient<Database>,
    props: ComputeDeltaProps
): Promise<void> {
    const { versionFrom, versionTo, objectType } = props;

    try {
        let deltaTable = "";

        if (objectType === "project") {
            deltaTable = "project_deltas";
        } else {
            deltaTable = "work_deltas";
        }

        // Compute the delta with a deep comparison between versionFrom and versionTo.
        const deltaData = deepCompare(versionFrom, versionTo);

        const { error: insertError } = await supabase
            .from(deltaTable)
            .insert([
                {
                    versionIdFrom: versionFrom.id,
                    versionIdTo: versionTo.id,
                    deltaData: JSON.stringify(deltaData),
                },
            ]);

        if (insertError) {
            throw new Error(`Failed to insert computed delta: ${insertError.message}`);
        }
    } catch (error) {
        console.error(`An error occurred while computing the delta: ${(error as any).message}`);
    }
}

export default computeDelta;


