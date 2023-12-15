import { ObjectDelta, TextDiff } from "@/types/versionControlTypes";

export function generateObjectDelta<T>(oldObj: T, newObj: T): ObjectDelta<T> {
    const delta: Partial<ObjectDelta<T>> = {};
    const existingDiffs: TextDiff[] = [];

    for (const key in newObj) {
        const actualKey = key as keyof T;
        const oldValue = oldObj[actualKey];
        const newValue = newObj[actualKey];

        if (oldValue !== newValue) {
            if (typeof oldValue === "string" && typeof newValue === "string") {
                // delta[actualKey as string] = generateTextDiff(
                //     oldValue,
                //     newValue,
                //     existingDiffs
                // );
            } else if (
                typeof oldValue === "object" &&
                typeof newValue === "object"
            ) {
                delta[actualKey as string] = generateObjectDelta(
                    oldValue as unknown as object,
                    newValue as unknown as object
                );
            }
        }
    }

    return delta as ObjectDelta<T>;
}
