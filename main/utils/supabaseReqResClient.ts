// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
// import { getCookie, setCookie } from "cookies-next";

// export async function createSupabaseReqResClient (req: Request, res: Response) {
//     return createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get(name) {
//                     return getCookie(name, { req, res });
//                 },
//                 set(name, value, options) {
//                     setCookie(name, value, { req, res, ...options });
//                 },
//                 remove(name, options) {
//                     setCookie(name, "", { req, res, ...options });
//                 }
//             }
//         }
//     )
// }
// // import { Database } from "@/types_db";
// // import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// // import { cookies } from "next/headers";

// // export default createServerComponentClient<Database>({ cookies });
