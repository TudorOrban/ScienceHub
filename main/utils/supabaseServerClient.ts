// // import { Database } from "@/types_db";
// // import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// // import { cookies } from "next/headers";

// // export default createServerComponentClient<Database>({ cookies });
// import { Database } from "@/types_db";
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function createSupabaseAppServerClient(serverComponent: boolean = false) {
//     return createServerClient<Database>(
//         process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
//         {
//             cookies: {
//                 get(name) {
//                     return cookies().get(name)?.value;
//                 },
//                 set(name, value, options) {
//                     if (serverComponent) return;
//                     cookies().set(name, value, options);
//                 },
//                 remove(name, options) {
//                     if (serverComponent) return;
//                     cookies().set(name, "", options);
//                 }
//             }
//         }
//     )
// } 

// export async function createSupabaseServerComponentClient() {
//     return createSupabaseAppServerClient(true);
// }