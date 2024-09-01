import { ProjectReviewSearchDTO } from "@/types/managementTypes";
import { PaginatedResults, Result } from "@/types/searchTypes";
import { SmallSearchOptionsNew } from "@/types/utilsTypes";



export const searchReviews = async ({
    entityId: projectId,
    enabled,
    searchQuery = '',
    page = 1,
    itemsPerPage = 10,
    sortBy = 'Name',
    sortDescending = false
}: SmallSearchOptionsNew): Promise<Result<PaginatedResults<ProjectReviewSearchDTO>>> => {
    const apiUrl = `http://localhost:8082/api/v1/reviews/project/${projectId}`
        + `?page=${page}`
        + `&itemsPerPage=${itemsPerPage}`
        + `&searchTerm=${encodeURIComponent(searchQuery)}`
        + `&sortBy=${encodeURIComponent(sortBy)}`
        + `&sortDescending=${sortDescending}`;
    
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
        console.error("An error occurred while creating the issue", errorData);
        return {
            data: {
                results: [],
                totalCount: 0,
            },
            error: {
                title: "An error occurred while creating the issue",
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