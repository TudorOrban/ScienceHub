import { Project, ProjectLayout } from "@/types/projectTypes";
import { TextDiff } from "@/types/versionControlTypes";
import { applyTextDiffs } from "./diff-logic/applyTextDiff";

export const mergeProjectDeltaIntoProjectData = (
    projectData: ProjectLayout,
    projectDeltaData: Record<string, TextDiff[]>,
): ProjectLayout => {
    // Create a deep copy of the projectData object
    const mergedProjectData: ProjectLayout = { ...projectData };

    // Loop through each delta in projectDelta
    for (const [field, diffs] of Object.entries(projectDeltaData)) {
        if (field in projectData) {
            const key = field as keyof ProjectLayout;

            // For text fields like description, license, etc.
            if (typeof mergedProjectData[key] === "string") {
                // Apply the diffs to get the final value
                const mergedValue = applyTextDiffs(
                    mergedProjectData[key] as string,
                    diffs
                );
                // Bypass TypeScript type checking
                (mergedProjectData as any)[key] = mergedValue;
            }
            // For complex objects like User[], Team[], etc.
            // You'll need to define your merging logic here
            // based on how the deltas for these objects are structured.
        }
    }


    return mergedProjectData;
};
  