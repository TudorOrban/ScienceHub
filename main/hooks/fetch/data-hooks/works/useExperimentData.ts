import { Citation, Experiment } from "@/types/workTypes";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";
import { FetchResult } from "@/services/fetch/fetchGeneralData";

const useExperimentData = (
    experimentId: number,
    enabled?: boolean,
    initialData?: FetchResult<Experiment>
): HookResult<Experiment> => {
    
    const experimentData = useGeneralData<Experiment>({
        fetchGeneralDataParams: {
            tableName: "experiments",
            categories: ["users", "projects"],
            withCounts: true,
            options: {
                tableRowsIds: [experimentId],
                page: 1,
                itemsPerPage: 10,
                categoriesFetchMode: {
                    users: "fields",
                    projects: "fields"
                },
                categoriesFields: {
                    users: ["id", "username", "full_name"],
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
                    source_object_id: [experimentId],
                    source_object_type: "Experiment",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    
    const experiment: Experiment[] = useMemo(() => {
        if (experimentData.data && citationData.data) {
            return [{
                ...experimentData.data[0],
                citations: citationData.data,
            }];
        } else return [];
    }, [experimentData.data, citationData.data]);

    const result: HookResult<Experiment> = {
        data: experiment,
        totalCount: experimentData.totalCount,
        isLoading: experimentData.isLoading,
        serviceError: experimentData.serviceError,
    };

    return result;
};

export default useExperimentData;
