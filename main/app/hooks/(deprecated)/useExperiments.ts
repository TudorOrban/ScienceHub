"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createExperiment } from "@/services/(deprecated)/createExperiment";
import {
    UpdateExperimentInput,
    updateExperiment,
} from "@/services/update/updateExperiment";
import { deleteExperiment } from "@/services/delete/deleteExperiment";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { fetchProjectData } from "@/services/fetch/fetchProjectData";
import { Experiment } from "@/types/workTypes";
import { CreateExperimentInput } from "@/types/utilsTypes";

type UseExperimentsOptions = {
    projectId: number;
};

export const useExperiments = (options: UseExperimentsOptions) => {
    const supabase = useSupabaseClient();
    const experimentsQueryKey = {
        queryKey: ["experiments", options.projectId],
    };

    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    const experimentsQuery = useQuery<Experiment[], Error>({
        queryKey: ["experiments", options.projectId],
        queryFn: async () => {
            const rawData = await fetchProjectData<{
                id: number;
                experiments: any[];
            }>(
                supabase, 
                {
                    projectId: options.projectId,
                    table: "experiments",
                }
            );

            return rawData.flatMap((item) =>
                item.experiments.map((experiment) => ({
                    id: experiment.id,
                    projectId: item.id,
                    title: experiment.title,
                    description: experiment.description,
                    methodology: experiment.methodology,
                    status: experiment.status,
                    public: experiment.public,
                }))
            );
        },
        staleTime: 5 * 1000,
    });

    return experimentsQuery;
};

// export const useCreateExperiment = () => {
//   const queryClient = new QueryClient();

//   const createExperimentMutation = useMutation<Experiment, Error, CreateExperimentInput>(
//     async (input: CreateExperimentInput) => {
//       const payload = {
//         title: input.title,
//         description: input.description,
//         methodology: input.methodology,
//         status: input.status,
//         public: input.public,
//       };

//     console.log("Payload:", payload);
//       const newExperiment = await createProjectData<Experiment>(
//         payload, 'experiments', input.projectId
//       );
//       console.log("New experiment:", newExperiment);
//       return newExperiment;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['experiments']);
//       },
//     }
//   );

//   return createExperimentMutation;
// };

export const useCreateExperiment = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (input: CreateExperimentInput) => {
            return createExperiment(supabase, input);
        },
    });
};

export const useDeleteExperiment = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (input: number) => {
            return deleteExperiment(supabase, input);
        },
    });
};

export const useUpdateExperiment = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (input: UpdateExperimentInput) => {
            return updateExperiment(supabase, input);
        },
    });
};

// useEffect(() => {
//   const folderChannel = supabase
//     .channel('schema-db-changes')
//     .on(
//       'postgres_changes',
//       {
//         event: 'INSERT',
//         schema: 'public',
//       },
//       (payload) => {
//         // Here, update your state or react-query cache with the new data
//         queryClient.invalidateQueries({
//           queryKey: ['experiments', options.projectId]
//         });
//       }
//     )
//     .subscribe();

//   return () => {
//     // Unsubscribe when the component unmounts
//     folderChannel.unsubscribe();
//   };
// }, []);
