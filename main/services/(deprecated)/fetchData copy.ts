import { FetchDataOptions } from "@/types/utilsTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const fetchData = async <T>(
    supabase: SupabaseClient<Database>,
    tableName: string,
    options?: FetchDataOptions
  ): Promise<SnakeCaseObject<T>[]> => {
    let query = supabase.from("ai_models").select("*,users(*)");

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return data as SnakeCaseObject<T>[];
};

export default fetchData;

type ToSnakeCase<S extends string> =
  S extends `${infer P1}${infer P2}${infer P3}`
    ? P2 extends Capitalize<P2>
      ? `${P1}_${Uncapitalize<P2>}${ToSnakeCase<P2 extends Capitalize<P2> ? `${P3}` : `${P2}${P3}`>}`
      : `${P1}${P2}${ToSnakeCase<P3>}`
    : S;

export type SnakeCaseObject<T> = {
  [K in keyof T as ToSnakeCase<string & K>]: T[K] extends object ? SnakeCaseObject<T[K]> : T[K];
};

// Application type
type MyType = {
  myField: string;
  anotherField: number;
  nestedObject: {
    nestedField: boolean;
  };
};

// Generated type
type MyTypeInSnakeCase = SnakeCaseObject<MyType>;
