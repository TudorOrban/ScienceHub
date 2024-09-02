import { searchProjectReviews } from "@/src/services/fetch/reviews/searchProjectReviews";
import { ProjectReviewSearchDTO } from "@/src/types/managementTypes";
import { PaginatedResults, Result, StdError } from "@/src/types/searchTypes";
import { SmallSearchOptionsNew } from "@/src/types/utilsTypes";
import { useQuery } from "@tanstack/react-query";
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


export const useSearchProjectReviewsRQ = (options: SmallSearchOptionsNew) => {
    const queryKey = ['projectReviews', options];
  
    const fetchProjectReviews = async () => {
        const response = await searchProjectReviews(options);
        if (response.error) {
          throw response; 
        }
        return response.data;
    };
  
    const { data, error, isLoading } = useQuery({
        queryKey,
        queryFn: fetchProjectReviews,
        enabled: options.enabled,
        keepPreviousData: true,
        staleTime: 5000,
        cacheTime: 30000,
        onError: (error) => {
          console.error('Error fetching project reviews:', error);
        }
      });
    
    const transformedError: StdError | undefined = (error && typeof error === 'object' && 'title' in error && 'message' in error) ? {
        title: (error as StdError).title,
        message: (error as StdError).message,
        code: (error as StdError).code
    } : undefined;
    
    return {
        data: data || { results: [], totalCount: 0 },
        error: transformedError,
        isLoading
    };
};