import { Citation, Paper } from "@/types/workTypes";
import { useMemo } from "react";
import { HookResult, useGeneralData } from "../../useGeneralData";

const usePaperData = (
    paperId: string,
    enabled?: boolean
): HookResult<Paper> => {
    const paperData = useGeneralData<Paper>({
        fetchGeneralDataParams: {
            tableName: "papers",
            categories: ["users"],
            withCounts: true,
            options: {
                tableRowsIds: [paperId],
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
                    source_object_id: [paperId],
                    source_object_type: "Paper",
                },
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    
    const paper: Paper[] = useMemo(() => {
        if (paperData.data && citationData.data) {
            return [{
                ...paperData.data[0],
                citations: citationData.data,
            }];
        } else return [];
    }, [paperData.data, citationData.data]);

    const result: HookResult<Paper> = {
        data: paper,
        totalCount: paperData.totalCount,
        isLoading: paperData.isLoading,
        serviceError: paperData.serviceError,
    };

    return result;
};

export default usePaperData;
