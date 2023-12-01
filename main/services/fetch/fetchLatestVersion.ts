import { ProjectVersion, WorkVersion } from "@/types/versionControlTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

async function fetchLatestVersion(
    supabase: SupabaseClient<Database>,
    objectType: "project" | "work",
    objectId: number
): Promise<ProjectVersion | WorkVersion | null> {
    let versionTable = "";
    if (objectType === "project") {
        versionTable = "project_versions";
    } else {
        versionTable = "work_versions";
    }

    const { data, error } = await supabase
        .from(versionTable)
        .select("*")
        .eq("id", objectId)
        .order("version_number", { ascending: false })
        .limit(1);

    if (error) {
        console.error(`Failed to fetch latest version: ${error.message}`);
        return null;
    }

    return data ? data[0] : null;
}

export default fetchLatestVersion;
