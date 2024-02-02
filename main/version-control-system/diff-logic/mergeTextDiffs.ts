import { TextDiff } from "@/types/versionControlTypes";

/**
 * Function for merging text diffs. To be moved to the backend.
 */
export const mergeTextDiffs = (a: TextDiff[], b: TextDiff[]): TextDiff[] => {
    const output: TextDiff[] = [];
    let offset = 0;

    // Sort a and b by their position field
    const sortedA = [...a].sort((x, y) => x.position - y.position);
    const sortedB = [...b].sort((x, y) => x.position - y.position);

    for (const diffB of sortedB) {
        // Adjust position of diffB based on the offset
        diffB.position += offset;

        for (const diffA of sortedA) {
            if (diffA.position <= diffB.position) {
                // Update the offset based on the length of the inserted and deleted text from 'a'
                offset += diffA.insert.length - diffA.deleteCount;
            } else {
                // Once diffA.position > diffB.position, break out of the loop
                break;
            }
        }
        // Further adjust position of diffB based on the updated offset
        diffB.position += offset;
        output.push(diffB);
    }

    return output;
};
