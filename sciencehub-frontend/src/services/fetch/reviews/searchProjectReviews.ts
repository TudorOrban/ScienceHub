import { ProjectReviewSearchDTO } from "@/src/types/managementTypes";
import { PaginatedResults, Result } from "@/src/types/searchTypes";
import { SmallSearchOptionsNew } from "@/src/types/utilsTypes";



export const searchProjectReviews = async ({
    entityId: projectId,
    enabled,
    searchQuery = '',
    page = 1,
    itemsPerPage = 10,
    sortBy = 'Name',
    sortDescending = false
}: SmallSearchOptionsNew): Promise<Result<PaginatedResults<ProjectReviewSearchDTO>>> => {
    const apiUrl = `http://localhost:8082/api/v1/project-reviews/project/${projectId}/search`
        + `?searchTerm=${encodeURIComponent(searchQuery)}`
        + `&sortBy=${encodeURIComponent(sortBy)}`
        + `&sortDescending=${sortDescending}`
        + `&page=${page}`
        + `&pageSize=${itemsPerPage}`;
    
    if (!projectId || !enabled) {
        return {
            data: {
                results: [],
                totalCount: 0,
            },
            error: {
                title: "Missing User ID",
                message: "User ID is not provided",
                code: 400,
            },
            isLoading: false,
        };
    }

    const response = await fetch(apiUrl, { method: "GET" });

    // Handle error
    if (!response.ok) {
        const errorData = await response.json();
        console.error("An error occurred while searching for project reviews", errorData);
        return {
            data: {
                results: [],
                totalCount: 0,
            },
            error: {
                title: "An error occurred while searching for project reviews",
                message: errorData.message,
                code: response.status,
            },
            isLoading: false,
        };
    }

    // Handle success
    const result: PaginatedResults<ProjectReviewSearchDTO> = await response.json();

    return {
        data: result,
        error: undefined,
        isLoading: false,
    };
}