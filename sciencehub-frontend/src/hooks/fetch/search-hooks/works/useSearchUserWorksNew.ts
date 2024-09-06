import { SmallSearchOptionsNew } from "@/src/types/utilsTypes";
import { WorkSearchDTO, WorkTypeNew } from "@/src/types/workTypes";
import { PaginatedResults, Result } from "@/src/types/searchTypes";
import { useEffect, useState } from "react";
import { searchUserWorks } from "@/src/services/fetch/works/searchUserWorks";

export const useSearchUserWorks = (options: SmallSearchOptionsNew, workType: WorkTypeNew) => {
    const [result, setResult] = useState<Result<PaginatedResults<WorkSearchDTO>>>({
        data: {
            results: [],
            totalCount: 0
        },
        isLoading: true,
        error: undefined
    });
    
    useEffect(() => {
        let isMounted = true;

        setResult(prev => ({ ...prev, isLoading: true }));

        searchUserWorks(options, workType).then(data => {
            console.log("Works: ", data);
            if (isMounted) {
                setResult({
                    data: data.data,
                    error: data.error,
                    isLoading: false
                });
            }
        });

        return () => {
            isMounted = false;
        };
    }, [options.entityId, options.enabled, options.page, options.itemsPerPage, options.searchQuery, options.sortBy, options.sortDescending]);

    return result;
};