import { ArrayDiff } from "@/types/versionControlTypes";

export function applyArrayDiffs<T>(original: T[], diffs: ArrayDiff<T>[]): T[] {
    let result = [...original];
    for (const diff of diffs) {
        switch (diff.operation) {
            case 'add':
                result.splice(diff.index, 0, diff.value);
                break;
            case 'remove':
                result.splice(diff.index, 1);
                break;
            case 'update':
                result[diff.index] = diff.value;
                break;
        }
    }
    return result;
}
