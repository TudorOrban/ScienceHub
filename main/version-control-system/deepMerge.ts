import { DeltaAction, TextDiff } from "@/types/versionControlTypes";
import { mergeTextDiffs } from "./diff-logic/mergeTextDiffs";

type DeepMergeValue = TextDiff[] | Object | string;

export const deepMerge = (
    target: Record<string, DeepMergeValue>,
    source: Record<string, DeepMergeValue>
): Record<string, DeepMergeValue> => {
    const output: Record<string, DeepMergeValue> = { ...target };

    for (const [key, value] of Object.entries(source)) {
        if (Array.isArray(value) && Array.isArray(target[key])) {
            // Merge TextDiffs if both target and source have TextDiff arrays at this key
            output[key] = mergeTextDiffs(
                target[key] as TextDiff[],
                value as TextDiff[]
            );
        } else if (
            typeof value === "object" &&
            !Array.isArray(value) &&
            target[key] &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])
        ) {
            // Recurse if both target and source have an object (but not an array) at this key
            output[key] = deepMerge(
                target[key] as Record<string, DeepMergeValue>,
                value as Record<string, DeepMergeValue>
            );
        } else {
            // Otherwise, simply set the key on the output to the value from source
            output[key] = value;
        }
    }

    return output;
};

export default deepMerge;