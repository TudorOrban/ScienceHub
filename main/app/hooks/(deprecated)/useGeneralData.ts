import { SnakeCaseObject, fetchData } from "@/services/(deprecated)/fetchData copy";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";// Replace with your actual Supabase hook import
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type UseDataOptions = {
//   tableName: string;
  // Add any other options you need
};

export const useData = <T>(
    // options: UseDataOptions,
    queryOptions?: UseQueryOptions<SnakeCaseObject<T>[], Error>
  ) => {
    const supabase = useSupabaseClient();
    const queryKey = ["data"]; // Replace with a more specific key if needed
  
    return useQuery<SnakeCaseObject<T>[], Error>(
      queryKey,
      () => fetchData<T>(supabase, ""),
      {
        staleTime: 5 * 1000,
        ...queryOptions,
      }
    );
  };
