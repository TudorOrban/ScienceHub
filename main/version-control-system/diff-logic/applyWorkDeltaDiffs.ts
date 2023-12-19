import { TextDiff, WorkDelta, WorkDeltaDiffsKey, WorkKey, WorkTextDiffsFields } from "@/types/versionControlTypes";
import { Work } from "@/types/workTypes";
import { applyTextDiffs } from "./applyTextDiff";
import { getWorkVersionedFields } from "@/config/worksVersionedFields.config";


export const applyWorkDeltaDiffs = (work: Work, deltaDiffs: WorkTextDiffsFields): Work => {
    // Copy work
    let updatedWork: Work = { ...work };
    // Get corresponding versioned fields
    const workVersionedFields = getWorkVersionedFields(work.workType || "");

    // For each such field, apply delta text diffs
    for (const key of Object.keys(deltaDiffs) as WorkDeltaDiffsKey[]) {
        if (!workVersionedFields?.includes(key)) continue;
        const currentValue = updatedWork[key as WorkKey];
        const deltaValue = deltaDiffs[key];

        if (deltaValue) {
            if (typeof currentValue === 'string' && Array.isArray(deltaValue)) {
                (updatedWork[key as WorkKey] as string) = applyTextDiffs(currentValue, deltaValue as TextDiff[]);
            } else if (typeof currentValue === 'boolean' && typeof deltaValue === 'boolean') {
                (updatedWork[key as WorkKey] as boolean) = deltaValue;
            }
        }
    }
    
    // For editor
    updatedWork.isModified = !!deltaDiffs;

    return updatedWork;
};

