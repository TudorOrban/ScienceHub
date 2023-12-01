import { Citation, Experiment } from "@/types/workTypes";
import { keysToCamelCase } from "@/utils/functions";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";

const useExperimentData = (
    experimentId: string,
    enabled?: boolean
): HookResult<Experiment> => {
    console.log("SANJA:,", experimentId, enabled);
    const experimentData = useGeneralData<Experiment>({
        fetchGeneralDataParams: {
            tableName: "experiments",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [experimentId],
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
                    source_object_id: [experimentId],
                    source_object_type: "Experiment",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    
    const experiment: Experiment = useMemo(() => {
        const firstExperiment = experimentData.data
            ? experimentData.data[0]
            : null;

        if (firstExperiment) {
            const transformedFirstExperiment = keysToCamelCase(firstExperiment);
            return {
                ...transformedFirstExperiment,
                citations: citationData,
            };
        }
        return null;
    }, [experimentData.data, citationData]);

    const result: HookResult<Experiment> = {
        data: [experiment],
        totalCount: experimentData.totalCount,
        isLoading: experimentData.isLoading,
        serviceError: experimentData.serviceError,
    };

    return result;
};

export default useExperimentData;
