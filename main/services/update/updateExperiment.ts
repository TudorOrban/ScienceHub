import { Experiment } from "@/types/workTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type UpdateExperimentInput = {
    experimentId: number;
    updates: Partial<Experiment>;
};

export const updateExperiment = async (
    supabase: SupabaseClient<Database>,
    input: UpdateExperimentInput
): Promise<Experiment> => {
    // const { data, error } = await supabase
        // .from("experiments")
        // .update(input.updates)
    //     // .eq("id", input.experimentId);

    // if (error) {
    //     throw error;
    // }

    // return data![0];
    return { id: 0, title: ""};
};
