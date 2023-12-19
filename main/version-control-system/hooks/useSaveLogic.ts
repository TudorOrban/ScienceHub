import { ProjectDelta, TextDiff } from "@/types/versionControlTypes";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ProjectLayout } from "@/types/projectTypes";
import { calculateDiffs } from "../diff-logic/calculateTextDiffs";
import { VersionInfo } from "./useSubmissionLogic";

type SaveLogicOutput = {
    handleSave: () => Promise<void>;
};

export function useSaveLogic(
    projectDeltaSubmissionId: number | null,
    projectId: number | null,
    projectDeltaId: number,
    versionInfo: VersionInfo | null,
    initialVersionProjectData: ProjectLayout,
    finalVersionProjectData: ProjectLayout,
    editableFields: string[]
): SaveLogicOutput {
    const { mutateAsync: updateProjectDeltaMutation } =
        useUpdateGeneralData<ProjectDelta>();

    const handleSave = async () => {
        try {
            if (projectDeltaSubmissionId && projectId) {
                let projectDelta: ProjectDelta = {
                    id: projectDeltaId,
                    initialProjectVersionId:
                        Number(versionInfo?.initialProjectVersionId) || 0,
                    finalProjectVersionId:
                        Number(versionInfo?.finalProjectVersionId) || 0,
                    deltaData: {},
                };

                for (const key of Object.keys(finalVersionProjectData) as Array<
                    keyof ProjectLayout
                >) {
                    if (editableFields.includes(key as string)) {
                        const diffs = calculateDiffs(
                            initialVersionProjectData[key] as string,
                            finalVersionProjectData[key] as string
                        );
                        projectDelta.deltaData[key] = diffs;
                    }
                }

                // Prepare the update fields, converting keys to snake_case to accommodate database names
                const updateFieldsSnakeCase: Partial<ProjectDelta> = {
                    delta_data: projectDelta.deltaData,
                    initial_project_version_id:
                        projectDelta.initialProjectVersionId,
                    final_project_version_id:
                        projectDelta.finalProjectVersionId,
                } as unknown as Partial<ProjectDelta>;

                // Update the database
                await updateProjectDeltaMutation({
                    tableName: "project_deltas",
                    identifierField: "id",
                    identifier: projectDelta.id,
                    updateFields: updateFieldsSnakeCase,
                });
            } else {
                console.warn(
                    "Cannot save: Missing projectDeltaSubmissionId or projectId"
                );
            }
        } catch (error) {
            console.error("Failed to save project delta:", error);
        }
    };
    return {
        handleSave,
    };
}
