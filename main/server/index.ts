import {
    FetchGeneralDataParams,
    GeneralFetchOptions,
    fetchGeneralData,
} from "@/services/fetch/fetchGeneralDataAPI";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { cookies } from "next/headers";
// import supabase from "@/utils/supabase";

export const FetchGeneralDataParamsSchema = z.object({
    // supabase: z.any(),
    tableName: z.string(),
    tableRowsIds: z.array(z.string()),
    categories: z.array(z.string()),
    tableNameFilters: z.record(z.any()).optional(),
    tableNameFields: z.array(z.string()).optional(),
    relationships: z.record(z.string()).optional(),
    options: z.object({
        inputQuery: z.string().optional(),
        filters: z.record(z.any()).optional(),
        sortOption: z.string().optional(),
        descending: z.boolean().optional(),
        page: z.number().optional(),
        itemsPerPage: z.number().optional(),
        fetchMode: z.string().optional(),
        categoriesFetchMode: z
            .record(
                z.union([
                    z.literal("all"),
                    z.literal("count"),
                    z.literal("none"),
                    z.literal("fields"),
                ])
            )
            .optional(),
        categoriesFields: z.record(z.array(z.string())).optional(),
    }),
});

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);

export const appRouter = router({
    getTodos: publicProcedure.query(async () => {
        return [1, 2, 3];
    }),
    // fetchDataset: publicProcedure
    //     .input(z.object({
    //         filename: z.string(),
    //         page: z.number().optional(),
    //         limit: z.number().optional(),
    //     }))
    //     .query(async ({ input }) => {
    //         const { filename, page = 1, limit = 100 } = input;
    //         return await parseDataF
    //     })
    // fetchGeneralData: publicProcedure
    //     .input(FetchGeneralDataParamsSchema)
    //     .query(async (opts) => {
    //         try {
    //             const { input } = opts;
    //             console.log("Backend Input:", input);
    //             return fetchGeneralData({ supabase, ...input});
    //         } catch (error) {
    //             console.log("Backend Error:", error);
    //             throw error;
    //         }
    //     }),
});

export type AppRouter = typeof appRouter;