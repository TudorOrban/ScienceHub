import { TextDiff } from "@/types/versionControlTypes";
import { formatDiffs } from "./formatDiffs";
import * as Diff from "diff";

export const calculateDiffs = (
    initialDescription: string,
    newDescription: string
): TextDiff[] => {
    const diff = Diff.diffChars(initialDescription, newDescription);
    return formatDiffs(diff);
};
