import { SmallSearchOptionsNew } from "@/src/types/utilsTypes";
import { ProjectSearchDTO } from "@/src/types/projectTypes";
import { PaginatedResults, Result } from "@/src/types/searchTypes";
import { useEffect, useState } from "react";
import { searchProjects } from "@/src/services/fetch/projects/searchProjects";

export const useProjectsSearch = (options: SmallSearchOptionsNew) => {
    const [result, setResult] = useState<Result<PaginatedResults<ProjectSearchDTO>>>({
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

        searchProjects(options).then(data => {
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