"use server";

import { revalidatePath } from "next/cache";

// For revalidating path on demand (with server actions)
export async function revalPath(path: string) {
    revalidatePath(path);
}