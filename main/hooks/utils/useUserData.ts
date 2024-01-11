import { HookResult, useGeneralData } from "../fetch/useGeneralData";
import { UserData } from "@/types/userTypes";

const useUserData = (userId: string, enabled?: boolean, limitResults?: boolean): HookResult<UserData> => {
    const categoriesLimits = limitResults ? {
        experiments: 10,
        datasets: 10,
        data_analyses: 10,
        ai_models: 10,
        code_blocks: 10,
        papers: 10,
    } : undefined;

    const userData = useGeneralData<UserData>({
        fetchGeneralDataParams: {
            tableName: "users",
            categories: [
                "experiments",
                "datasets",
                "data_analyses",
                "ai_models",
                "code_blocks",
                "papers",
            ],
            options: {
                tableRowsIds: [userId],
                categoriesFetchMode: {
                    users: "fields",
                    experiments: "fields",
                    datasets: "fields",
                    data_analyses: "fields",
                    ai_models: "fields",
                    code_blocks: "fields",
                    papers: "fields",
                },
                tableFields: [
                    "id", "full_name", "username", 
                ],
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    experiments: ["id", "title", "folder_id", "created_at", "work_type"],
                    datasets: ["id", "title", "folder_id", "created_at", "work_type"],
                    data_analyses: ["id", "title", "folder_id", "created_at", "work_type"],
                    ai_models: ["id", "title", "folder_id", "created_at", "work_type"],
                    code_blocks: ["id", "title", "folder_id", "created_at", "work_type"],
                    papers: ["id", "title", "folder_id", "created_at", "work_type"],
                },
                categoriesLimits: categoriesLimits,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
        },
    });
    
    return userData;
};

export default useUserData;
