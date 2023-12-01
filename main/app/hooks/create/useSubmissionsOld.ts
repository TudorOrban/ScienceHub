"use client";

import createSubmission, { CreateSubmissionProps } from "@/services/create/createSubmission";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export const useCreateSubmission = () => {
    const supabase = useSupabaseClient();

    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (props: CreateSubmissionProps) =>
            createSubmission(supabase, props),
    });
};
