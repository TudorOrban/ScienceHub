import { CreateProjectDataInput } from "@/types/utilsTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createProjectData = async <T>(
    supabase: SupabaseClient<Database>,
    input: CreateProjectDataInput,
    fileType: string,
    projectId: number
): Promise<T> => {
    const { data, error } = await supabase.from(fileType).insert([input]);

    if (error) {
        console.error("Supabase Error: ", error);
        throw error;
    }

    if (!data) {
        throw new Error("No data returned from insert operation");
    }

    if (data && fileType === "experiments" && projectId) {
        const junctionData = {
            project_id: projectId,
            experiment_id: (data[1] as any).id,
        };

        const { error: junctionError } = await supabase
            .from("project_experiments")
            .insert([junctionData]);

        if (junctionError) {
            throw junctionError;
        }
    }

    return data![0] as T;
};
