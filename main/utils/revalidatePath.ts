"use server";

import { revalidatePath } from "next/cache";

// For revalidating path on demand (with server actions)
export const revalPath = async (path: string) => {
    "use server";
    revalidatePath(path);
}