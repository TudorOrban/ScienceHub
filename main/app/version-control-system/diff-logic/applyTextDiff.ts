import { TextDiff } from "@/types/versionControlTypes";

export const applyTextDiffs = (original: string, diffs: TextDiff[]): string => {
    let originalArray = original.split("");
    let operationOffset = 0;
    diffs.forEach(({ position, deleteCount, insert }) => {
        let adjustedPosition = position + operationOffset;

        // Perform deletion
        if (deleteCount > 0) {
            originalArray.splice(adjustedPosition, deleteCount);
            operationOffset -= deleteCount;
        }

        // Perform insertion
        if (insert) {
            originalArray.splice(adjustedPosition, 0, ...insert.split(""));
            operationOffset += insert.length;
        }
    });

    return originalArray.join("");
};