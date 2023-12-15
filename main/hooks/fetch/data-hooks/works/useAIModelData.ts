import { Citation, AIModel } from "@/types/workTypes";
import { keysToCamelCase } from "@/utils/functions";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useAIModelData = (
    aiModelId: string,
    enabled?: boolean
): HookResult<AIModel> => {
    const aiModelData = useGeneralData<AIModel>({
        fetchGeneralDataParams: {
            tableName: "ai_models",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [aiModelId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
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
    
    const aiModel: AIModel = useMemo(() => {
        const firstAIModel = aiModelData.data
            ? aiModelData.data[0]
            : null;

        if (firstAIModel) {
            const transformedFirstAIModel = keysToCamelCase(firstAIModel);
            return {
                ...transformedFirstAIModel,
                citations: citationData,
            };
        }
        return null;
    }, [aiModelData.data, citationData]);

    const result: HookResult<AIModel> = {
        data: [aiModel],
        totalCount: aiModelData.totalCount,
        isLoading: aiModelData.isLoading,
        serviceError: aiModelData.serviceError,
    };

    return result;
};

export default useAIModelData;
