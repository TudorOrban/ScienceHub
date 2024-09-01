import { UserSettings } from "@/src/types/userTypes";
import { useGeneralData } from "../fetch/useGeneralData";

const useEditorSettings = (userId: string, enabled?: boolean) => {
    const userEditorSettingsData = useGeneralData<UserSettings>({
        fetchGeneralDataParams: {
            tableName: "user_settings",
            categories: [],
            options: {
                tableFilterRow: "user_id",
                tableRowsIds: [userId],
                tableFields: ["user_id", "editor_settings"],
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    
    return userEditorSettingsData;
};

export default useEditorSettings;
