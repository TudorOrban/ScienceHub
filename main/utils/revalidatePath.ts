"use server";

import { revalidatePath } from "next/cache";

/**
 * For revalidating a path on demand with server actions
 */
export async function revalPath(path: string) {
    revalidatePath(path);
}
