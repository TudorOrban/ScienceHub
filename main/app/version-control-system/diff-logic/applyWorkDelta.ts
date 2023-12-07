import { WorkDelta } from "@/types/versionControlTypes";
import { Work } from "@/types/workTypes";
import { applyTextDiffs } from "./applyTextDiff";

type WorkDeltaKeys = keyof WorkDelta;
type WorkKeys = keyof Work;

export const applyWorkDelta = (work: Work, delta: WorkDelta): Work => {
    let updatedWork: Work = { ...work };

    for (const key of Object.keys(delta) as WorkDeltaKeys[]) {
        const currentValue = updatedWork[key as WorkKeys];
        const deltaValue = delta[key];

        if (deltaValue) {
            if (typeof currentValue === 'string' && Array.isArray(deltaValue)) {
                // Assert that the key is a string property of Work
                (updatedWork[key as WorkKeys] as any) = applyTextDiffs(currentValue, deltaValue);
            } else if (typeof currentValue === 'boolean' && typeof deltaValue === 'boolean') {
                (updatedWork[key as WorkKeys] as any) = deltaValue;
            }
            // Add additional conditions for other types if necessary
        }
    }

    return updatedWork;
};

