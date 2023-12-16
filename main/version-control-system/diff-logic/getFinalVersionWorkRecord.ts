import { TextDiff, WorkCamelKey, WorkDelta, WorkDeltaDiffsKey, WorkKey, WorkTextFieldsDiffs } from "@/types/versionControlTypes";
import { Work } from "@/types/workTypes";
import { applyTextDiffs } from "./applyTextDiff";
import { getWorkVersionedFields } from "@/config/worksVersionedFields.config";
import { camelCase } from "@/utils/functions";

export type PartialWorkRecord = Partial<Record<WorkCamelKey, string>>;

export const getFinalVersionWorkRecord = (
    work: Work, 
    deltaDiffs: WorkTextFieldsDiffs
): PartialWorkRecord => {
    const workVersionedFields = getWorkVersionedFields(work.workType || "");
    let finalVersionRecord: PartialWorkRecord = {};

    // Loop through keys in deltaDiffs and apply them to corresponding work fields
    for (const key of Object.keys(deltaDiffs) as WorkDeltaDiffsKey[]) {
        if (!workVersionedFields?.includes(key) || deltaDiffs[key]?.length === 0) continue;
        const currentValue = work[key as WorkKey] ?? "";
        const deltaValue = deltaDiffs[key];

        if (deltaValue) {
            if (typeof currentValue === 'string' && Array.isArray(deltaValue)) {
                const result = applyTextDiffs(currentValue, deltaValue as TextDiff[]);
                // Convert the key to its camel-cased version
                const camelKey = camelCase(key) as keyof typeof finalVersionRecord;
                finalVersionRecord[camelKey] = result;
            }
        }
    }

    // console.log("DADASD", finalVersionRecord, deltaDiffs);
    return finalVersionRecord;
};
