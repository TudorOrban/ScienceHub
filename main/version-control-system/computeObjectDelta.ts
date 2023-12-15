import { ObjectDelta, TextDiff } from "@/types/versionControlTypes";
import { computeTextDiff } from "./computeTextDiff";

export function computeObjectDelta<T>(
    originalObj: T,
    newObj: T
): ObjectDelta<T> {
    const delta: Partial<Record<keyof T, TextDiff[] | ObjectDelta<any>>> = {};

    for (const key in originalObj) {
        const originalValue = originalObj[key];
        const newValue = newObj[key];

        if (typeof originalValue === "string" && typeof newValue === "string") {
            const textDiffs = computeTextDiff(originalValue, newValue);
            if (textDiffs.length > 0) {
                delta[key] = textDiffs;
            }
        } else if (
            typeof originalValue === "object" &&
            typeof newValue === "object"
        ) {
            const objectDelta = computeObjectDelta(originalValue, newValue);
            if (Object.keys(objectDelta).length > 0) {
                delta[key] = objectDelta;
            }
        }
    }

    return delta as ObjectDelta<T>;
}
