import { TextDiff } from "@/types/versionControlTypes";
import { formatDiffs } from "./formatDiffs";
import * as Diff from "diff";

export const calculateDiffs = (
    initialText: string,
    newText: string
): TextDiff[] => {
    const diff = Diff.diffChars(initialText, newText);
    return formatDiffs(diff);
};
