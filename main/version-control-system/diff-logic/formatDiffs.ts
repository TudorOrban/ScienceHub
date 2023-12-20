import { TextDiff } from "@/types/versionControlTypes";

export const formatDiffs = (diffArray: any[]): TextDiff[] => {
    let position = 0; // Initialize position to 0
    const transformed: TextDiff[] = [];

    for (const part of diffArray) {
        if (part.added) {
            transformed.push({ position, deleteCount: 0, insert: part.value });
        } else if (part.removed) {
            transformed.push({
                position, // Use the current position for removal
                deleteCount: part.value.length,
                insert: "",
            });
        }

        // Update the position only if the text is not added.
        // This ensures that the position points to the original string's characters.
        if (!part.added) {
            position += part.value.length;
        }
    }

    return transformed;
};
