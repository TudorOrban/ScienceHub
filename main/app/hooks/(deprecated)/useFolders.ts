"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchFolders } from "@/services/fetch/fetchFolders";
import { QueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
    CreateFolderInput,
    createFolder,
} from "@/services/(deprecated)/createFolder";
import { deleteFolder } from "@/services/delete/deleteFolder";
import {
    UpdateFolderInput,
    updateFolder,
} from "@/services/update/updateFolder";
import { Folder } from "@/types/workTypes";

type UseFoldersOptions = {
    projectId: number;
};

export const useFolders = (options: UseFoldersOptions) => {
    const supabase = useSupabaseClient();
    const foldersQueryKey = { queryKey: ["folders", options.projectId] };

    return useQuery<Folder[], Error>({
        queryKey: ["folders", options.projectId],
        queryFn: () => fetchFolders(supabase, { projectId: options.projectId }),
        //suspense: true,
        staleTime: 5 * 1000,
    });
};

export const useCreateFolder = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (input: CreateFolderInput) => {
            return createFolder(supabase, input);
        },
    });
};

export const useDeleteFolder = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (input: number) => {
            return deleteFolder(supabase, input);
        },
    });
};

export const useUpdateFolder = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    return useMutation({
        mutationFn: (input: UpdateFolderInput) => {
            return updateFolder(supabase, input);
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
//           queryKey: ['folders', options.projectId]
//         });
//       }
//     )
//     .subscribe();

//   return () => {
//     // Unsubscribe when the component unmounts
//     folderChannel.unsubscribe();
//   };
// }, []);
