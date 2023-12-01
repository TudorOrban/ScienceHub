import { TextDiff } from "@/types/versionControlTypes";

export function computeTextDiff(
    originalText: string,
    newText: string
): TextDiff[] {
    const diffs: TextDiff[] = [];

    let position = 0;
    let deleteCount = 0;

    for (let i = 0; i < Math.min(originalText.length, newText.length); i++) {
        if (originalText[i] !== newText[i]) {
            position = i;
            break;
        }
    }

    if (originalText.length !== newText.length || position !== 0) {
        deleteCount = originalText.length - position;
        const insert = newText.substring(position);

        diffs.push({
            position,
            deleteCount,
            insert,
        });
    }

    return diffs;
}
