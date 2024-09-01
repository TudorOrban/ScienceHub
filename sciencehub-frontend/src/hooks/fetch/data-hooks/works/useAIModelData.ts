import { Citation, AIModel } from "@/src/types/workTypes";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { FetchResult } from "@/src/services/fetch/fetchGeneralData";

const useAIModelData = (
    aiModelId: number,
    enabled?: boolean,
    initialData?: FetchResult<AIModel>,
): HookResult<AIModel> => {
    const aiModelData = useGeneralData<AIModel>({
        fetchGeneralDataParams: {
            tableName: "ai_models",
            categories: ["users", "teams", "projects"],
            withCounts: true,
            options: {
                tableRowsIds: [aiModelId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    teams: "fields",
                    projects: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                    teams: ["id", "team_name", "team_username"],
                    projects: ["id", "title", "name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
            includeRefetch: true,
            initialData: initialData,
        },
    });

    const citationData = useGeneralData<Citation>({
        fetchGeneralDataParams: {
            tableName: "citations",
            categories: [],
            options: {
                filters: {
                    source_object_id: [aiModelId],
                    source_object_type: "AIModel",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    
    const aiModel: AIModel[] = useMemo(() => {
        if (aiModelData.data && citationData.data) {
            return [{
                ...aiModelData.data[0],
                citations: citationData.data,
            }];
        } else return [];
    }, [aiModelData.data, citationData.data]);

    const result: HookResult<AIModel> = {
        data: aiModel,
        totalCount: aiModelData.totalCount,
        isLoading: aiModelData.isLoading,
        serviceError: aiModelData.serviceError,
    };

    return result;
};

export default useAIModelData;
