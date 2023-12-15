import { TextDiff } from "@/types/versionControlTypes";

export const mergeAdjacentDiffs = (existingDiffs: TextDiff[]): TextDiff[] => {
    existingDiffs.sort((a, b) => a.position - b.position);

    const mergedDiffs: TextDiff[] = [];
    let currentDiff: TextDiff | null = null;

    for (const diff of existingDiffs) {
        if (currentDiff === null) {
            currentDiff = { ...diff };
            continue;
        }

        const currentEnd = currentDiff.position + currentDiff.deleteCount;
        const nextStart = diff.position;

        // Check if the diffs are adjacent or overlapping
        if (currentEnd >= nextStart) {
            // Merge the diffs
            currentDiff.deleteCount =
                Math.max(currentEnd, nextStart + diff.deleteCount) -
                currentDiff.position;
            currentDiff.insert += diff.insert;
        } else {
            // The diffs are separate; add the currentDiff to mergedDiffs and start a new currentDiff
            mergedDiffs.push(currentDiff);
            currentDiff = { ...diff };
        }
    }

    if (currentDiff !== null) {
        mergedDiffs.push(currentDiff);
    }

    return mergedDiffs;
};