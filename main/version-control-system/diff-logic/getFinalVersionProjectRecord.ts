import { ProjectDelta, ProjectDeltaKey } from "@/types/versionControlTypes";
import {
    ProjectLayout,
    ProjectLayoutSnakeCaseKey,
    ProjectLayoutKey,
    ProjectMetadataSnakeCaseKey,
} from "@/types/projectTypes";
import { applyTextDiffs } from "./applyTextDiff";
import { metadataVersionedFields } from "@/config/projectVersionedFields.config";
import { camelCase } from "@/services/fetch/fetchGeneralData";
import { Json } from "@/types_db";

export type PartialProjectRecord = Partial<Record<ProjectLayoutSnakeCaseKey, Json>>;

export const getFinalVersionProjectRecord = (project: ProjectLayout, delta: ProjectDelta): PartialProjectRecord => {
    let finalVersionRecord: PartialProjectRecord = {};
    finalVersionRecord.project_metadata = {};

    // Loop through keys in delta and apply diffs/arrays to corresponding project fields
    for (const key of Object.keys(delta) as ProjectDeltaKey[]) {
        const textDiffs = delta[key as ProjectDeltaKey]?.textDiffs;
        const textArrays = delta[key as ProjectDeltaKey]?.textArrays;
        if ((!textDiffs || textDiffs?.length === 0) && (!textArrays || textArrays?.length === 0))
            continue;

        const snakeCaseKey = camelCase(key);

        const metadataField = metadataVersionedFields.find((field) => field.key === key);
        // Slightly different depending on whether metadata field
        if (metadataField) {
            if (metadataField.type === "TextDiff") {
                if (!textDiffs || textDiffs?.length === 0) continue;
                // Apply text diff
                finalVersionRecord.project_metadata[snakeCaseKey as ProjectMetadataSnakeCaseKey] =
                    applyTextDiffs((project[key as ProjectLayoutKey] as string) ?? "", textDiffs);
            } else {
                // Simply assign delta value to project field
                if (!textArrays || textArrays?.length === 0) continue;
                finalVersionRecord.project_metadata[snakeCaseKey as ProjectMetadataSnakeCaseKey] =
                    textArrays;
            }
        } else {
            if (!textDiffs || textDiffs?.length === 0) continue;
            finalVersionRecord[snakeCaseKey as ProjectLayoutSnakeCaseKey] = applyTextDiffs(
                (project[key as ProjectLayoutKey] as string) ?? "",
                textDiffs
            );
        }
    }

    console.log("DADASD", delta, project, finalVersionRecord);
    return finalVersionRecord;
};
