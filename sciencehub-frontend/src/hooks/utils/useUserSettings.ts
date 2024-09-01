import { UserSettings } from "@/src/types/userTypes";
import { useGeneralData } from "../fetch/useGeneralData";

const useUserSettings = (userId: string, enabled?: boolean) => {
    const userSettingsData = useGeneralData<UserSettings>({
        fetchGeneralDataParams: {
            tableName: "user_settings",
            categories: [],
            options: {
                tableFilterRow: "user_id",
                tableRowsIds: [userId],
                tableFields: ["user_id", "research_highlights", "pinned_pages"]
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            staleTime: 1000 * 60 * 60,
            includeRefetch: true,
        },
    });
    
    return userSettingsData;
};

export default useUserSettings;
