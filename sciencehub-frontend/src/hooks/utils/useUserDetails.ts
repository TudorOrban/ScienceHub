import { UserFullDetails } from "@/src/types/userTypes";
import { useGeneralData } from "../fetch/useGeneralData";

const useUserDetails = (userId: string, enabled?: boolean) => {
    const userDetailsData = useGeneralData<UserFullDetails>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [],
            options: {
                tableRowsIds: [userId],
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    
    return userDetailsData;
};

export default useUserDetails;
