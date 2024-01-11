import { ProjectLayout } from "@/types/projectTypes";
import { applyTextDiffs } from "../diff-logic/applyTextDiff";
import { ProjectDelta, TextDiff } from "@/types/versionControlTypes";

type ApplyProjectDeltaProps = {
    projectVersionId: string;
    projectData: ProjectLayout;
    projectDelta: ProjectDelta;
};

export const applyProjectDelta = (
    props: ApplyProjectDeltaProps
): ProjectLayout => {
    const { projectVersionId, projectData, projectDelta } = props;

    // Create a deep copy of the projectData object
    const updatedProjectData: ProjectLayout = { ...projectData };
    // Loop through each delta in projectDelta
    for (const [field, diffs] of Object.entries(projectDelta)) {
        
        if (field in projectData) {
            const key = field as keyof ProjectLayout;

            // For text fields like description, license, etc.
            if (typeof updatedProjectData[key] === "string") {
                // Apply the diffs to get the final value
                const updatedValue = applyTextDiffs(
                    updatedProjectData[key] as string,
                    diffs as TextDiff[]
                );
                // Bypass TypeScript type checking
                (updatedProjectData as any)[key] = updatedValue;
            }
            // For complex objects like User[], Team[], etc.
            // You'll need to define your merging logic here
            // based on how the deltas for these objects are structured.
        }
    }

    return updatedProjectData;
};