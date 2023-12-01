import { CreateExperimentInput } from "@/types/utilsTypes";
import { Experiment } from "@/types/workTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createExperiment = async (
    supabase: SupabaseClient<Database>,
    input: CreateExperimentInput
): Promise<Experiment> => {
    let { error } = await supabase.from("experiments").insert([input]);

    if (error) {
        console.error("Supabase Insert Error: ", error);
        throw error;
    }

    const { data, error: fetchError } = await supabase
        .from("experiments")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);

    if (fetchError) {
        console.error("Supabase Fetch Error: ", fetchError);
        throw fetchError;
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned from fetch operation");
    }

    return data[0] as any;
};
