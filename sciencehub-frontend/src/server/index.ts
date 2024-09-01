import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import supabase from "@/src/utils/supabase";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";

/**
 * TRPC endpoints. NOT CURRENTLY USED.
 */

// Define a Zod schema for FetchGeneralDataParams
const MediumSearchOptionsSchema = z.object({
    searchByField: z.string().optional(),
    searchByCategory: z.string().optional(),
    searchByCategoryField: z.string().optional(),
    tableRowsIds: z.array(z.union([z.string(), z.number()])).optional(),
    tableFields: z.array(z.string()).optional(),
    tableFilters: z.record(z.any()).optional(),
    tableFilterRow: z.string().optional(),
    inputQuery: z.string().optional(),
    filters: z.record(z.any()).optional(),
    negativeFilters: z.record(z.any()).optional(),
    sortOption: z.string().optional(),
    descending: z.boolean().optional(),
    page: z.number().optional(),
    itemsPerPage: z.number().optional(),
    categoriesFetchMode: z.record(z.enum(["all", "count", "none", "fields"])).optional(),
    categoriesFields: z.record(z.array(z.string())).optional(),
    categoriesLimits: z.record(z.number()).optional(),
    relationshipNames: z.record(z.string()).optional(),
});

const FetchGeneralDataParamsSchema = z.object({
    tableName: z.string(),
    categories: z.array(z.string()).optional(),
    withCounts: z.boolean().optional(),
    options: MediumSearchOptionsSchema,
});

export const appRouter = router({
    fetchGeneralData: publicProcedure
        .input(FetchGeneralDataParamsSchema)
        .query(async ({ input }) => {
            try {
                return await fetchGeneralData(supabase, input);
            } catch (error) {
                console.error("Backend Error:", error);
                throw error;
            }
        }),
});

export type AppRouter = typeof appRouter;
