import { useMutation } from "@tanstack/react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { CreateProjectExperimentRelationshipInput, createProjectExperimentRelationship } from "@/services/(deprecated)/createProjectExperimentRelationship";

export const useCreateProjectExperimentRelationship = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation<null, Error, CreateProjectExperimentRelationshipInput>(
        async (input: CreateProjectExperimentRelationshipInput) => {
            return await createProjectExperimentRelationship(supabase, input);
        }
    );
};