import {
    GeneralManyToManyInput,
    createGeneralManyToManyEntry,
} from "@/services/create/createGeneralManyToManyEntry";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";

export type ManyToManyResponse = {
    [key: string]: number | string | null | undefined;
} | null;

export const useCreateGeneralManyToManyEntry = () => {
    const supabase = useSupabaseClient();
    if (!supabase) {
        throw new Error("Supabase client is not available");
    }

    // return useMutation<ManyToManyResponse, Error, GeneralManyToManyInput>(
    //     async (input) => {
    //         return await createGeneralManyToManyEntry({
    //             supabase,
    //             tableName: input.tableName,
    //             firstEntityColumnName: input.firstEntityColumnName,
    //             firstEntityId: input.firstEntityId,
    //             secondEntityColumnName: input.secondEntityColumnName,
    //             secondEntityId: input.secondEntityId
    //         });
    //     }
    // );
    return useMutation<ManyToManyResponse, any, GeneralManyToManyInput>(
        async (input) => {
            return await createGeneralManyToManyEntry({
                supabase,
                tableName: input.tableName,
                firstEntityColumnName: input.firstEntityColumnName,
                firstEntityId: input.firstEntityId,
                secondEntityColumnName: input.secondEntityColumnName,
                secondEntityId: input.secondEntityId,
            });
        }
    );
};
