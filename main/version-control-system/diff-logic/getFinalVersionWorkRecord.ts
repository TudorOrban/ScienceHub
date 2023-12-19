import { ArrayDiff, MetadataDiffs, TextDiff, WorkDelta, WorkDeltaKey } from "@/types/versionControlTypes";
import { FileLocation, Work, WorkCamelKey, WorkKey, WorkMetadata } from "@/types/workTypes";
import { applyTextDiffs } from "./applyTextDiff";
import {
    getWorkVersionedFields,
    metadataVersionedFields,
} from "@/config/worksVersionedFields.config";
import { camelCase } from "@/services/fetch/fetchGeneralData";
import { applyArrayDiffs } from "./applyArrayDiffs";

export type PartialWorkRecord = Partial<Record<WorkCamelKey, string | string[] | FileLocation>>;

export const getFinalVersionWorkRecord = (work: Work, delta: WorkDelta): PartialWorkRecord => {
    const workVersionedFields = getWorkVersionedFields(work.workType || "");
    let finalVersionRecord: PartialWorkRecord = {};

    // Loop through keys in deltaDiffs and apply them to corresponding work fields
    for (const key of Object.keys(delta)) {
        const camelKey = camelCase(key) as keyof typeof finalVersionRecord;

        // Apply metadata diffs
        if (key === "workMetadata") {
            const metadataDelta = delta[key] || {};
            for (const metadataKey of Object.keys(metadataDelta)) {
                const metadataVersionedField = metadataVersionedFields.find(
                    (field) => field.key === metadataKey
                );

                if (metadataVersionedField?.type === "TextDiff") {
                    // For string fields
                    const currentValue = work.workMetadata?.[metadataKey as keyof WorkMetadata] as string ?? "";
                    const deltaValue = delta[key as WorkDeltaKey];
                    if (deltaValue && Array.isArray(deltaValue) && typeof currentValue === "string") {
                        finalVersionRecord[camelKey] = applyTextDiffs(currentValue, deltaValue as TextDiff[]);
                    }
                } else if (metadataVersionedField?.type === "ArrayDiff") {
                    // For string[] fields
                    finalVersionRecord[camelKey] = applyArrayDiffs<string>(
                        work.workMetadata?.[metadataKey as keyof WorkMetadata] as string[],
                        metadataDelta?.[metadataKey as keyof MetadataDiffs] as ArrayDiff<string>[],
                    );
                }
            }
        }

        // Apply main fields diffs
        if (workVersionedFields?.includes(key as WorkKey)) {
            const currentValue = work[key as WorkKey] ?? "";
            const deltaValue = delta[key as WorkDeltaKey];

            if (deltaValue && Array.isArray(deltaValue) && typeof currentValue === "string") {
                finalVersionRecord[camelKey] = applyTextDiffs(currentValue, deltaValue as TextDiff[]);
            }
        }
    }

    // console.log("DADASD", finalVersionRecord, deltaDiffs);
    return finalVersionRecord;
};
