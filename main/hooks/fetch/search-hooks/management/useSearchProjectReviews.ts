import { searchProjectReviews } from "@/services/fetch/reviews/searchProjectReviews";
import { ProjectReviewSearchDTO } from "@/types/managementTypes";
import { PaginatedResults, Result } from "@/types/searchTypes";
import { SmallSearchOptionsNew } from "@/types/utilsTypes";
import { useEffect, useState } from "react";


export const useSearchProjectReviews = (options: SmallSearchOptionsNew) => {
    const [result, setResult] = useState<Result<PaginatedResults<ProjectReviewSearchDTO>>>({
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

        searchProjectReviews(options).then(data => {
            console.log("Projects: ", data);
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