import { Citation, Paper } from "@/types/workTypes";
import { keysToCamelCase } from "@/utils/functions";
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
    
    const paper: Paper = useMemo(() => {
        const firstPaper = paperData.data
            ? paperData.data[0]
            : null;

        if (firstPaper) {
            const transformedFirstPaper = keysToCamelCase(firstPaper);
            return {
                ...transformedFirstPaper,
                citations: citationData,
            };
        }
        return null;
    }, [paperData.data, citationData]);

    const result: HookResult<Paper> = {
        data: [paper],
        totalCount: paperData.totalCount,
        isLoading: paperData.isLoading,
        serviceError: paperData.serviceError,
    };

    return result;
};

export default usePaperData;
