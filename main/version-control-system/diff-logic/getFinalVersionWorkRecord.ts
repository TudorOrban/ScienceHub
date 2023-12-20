import { WorkDelta, WorkDeltaKey } from "@/types/versionControlTypes";
import {
    FileLocation,
    Work,
    WorkSnakeCaseKey,
    WorkKey,
    WorkMetadataSnakeCaseKey,
} from "@/types/workTypes";
import { applyTextDiffs } from "./applyTextDiff";
import { metadataVersionedFields } from "@/config/worksVersionedFields.config";
import { camelCase } from "@/services/fetch/fetchGeneralData";
import { Json } from "@/types_db";

export type PartialWorkRecord = Partial<Record<WorkSnakeCaseKey, Json | FileLocation>>;

export const getFinalVersionWorkRecord = (work: Work, delta: WorkDelta): PartialWorkRecord => {
    let finalVersionRecord: PartialWorkRecord = {};
    finalVersionRecord.work_metadata = {};

    // Loop through keys in delta and apply diffs/arrays to corresponding work fields
    for (const key of Object.keys(delta) as WorkDeltaKey[]) {
        const textDiffs = delta[key as WorkDeltaKey]?.textDiffs;
        const textArrays = delta[key as WorkDeltaKey]?.textArrays;
        if ((!textDiffs || textDiffs?.length === 0) && (!textArrays || textArrays?.length === 0))
            continue;

        const snakeCaseKey = camelCase(key);

        const metadataField = metadataVersionedFields.find((field) => field.key === key);
        // Slightly different depending on whether metadata field
        if (metadataField) {
            if (metadataField.type === "TextDiff") {
                if (!textDiffs || textDiffs?.length === 0) continue;
                // Apply text diff
                finalVersionRecord.work_metadata[snakeCaseKey as WorkMetadataSnakeCaseKey] =
                    applyTextDiffs((work[key as WorkKey] as string) ?? "", textDiffs);
            } else {
                // Simply assign delta value to work field
                if (!textArrays || textArrays?.length === 0) continue;
                finalVersionRecord.work_metadata[snakeCaseKey as WorkMetadataSnakeCaseKey] =
                    textArrays;
            }
        } else {
            if (!textDiffs || textDiffs?.length === 0) continue;
            finalVersionRecord[snakeCaseKey as WorkSnakeCaseKey] = applyTextDiffs(
                (work[key as WorkKey] as string) ?? "",
                textDiffs
            );
        }
    }

    console.log("DADASD", delta, work, finalVersionRecord);
    return finalVersionRecord;
};
