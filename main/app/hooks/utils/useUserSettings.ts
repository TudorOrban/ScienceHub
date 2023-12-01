import { UserSettings } from "@/types/userTypes";
import { useGeneralData } from "../fetch/useGeneralData";

const useUserSettings = (userId: string, enabled?: boolean) => {
    const userSettingsData = useGeneralData<UserSettings>({
        fetchGeneralDataParams: {
            tableName: "user_settings",
            categories: [],
            options: {
                tableFilterRow: "user_id",
                tableRowsIds: [userId],
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    
    return userSettingsData;
};

export default useUserSettings;
