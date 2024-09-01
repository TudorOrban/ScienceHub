import { WorkReviewSearchDTO } from "@/types/managementTypes";
import { PaginatedResults, Result } from "@/types/searchTypes";
import { SmallSearchOptionsNew } from "@/types/utilsTypes";



export const searchWorkReviews = async ({
    entityId: workId,
    enabled,
    searchQuery = '',
    page = 1,
    itemsPerPage = 10,
    sortBy = 'Name',
    sortDescending = false
}: SmallSearchOptionsNew): Promise<Result<PaginatedResults<WorkReviewSearchDTO>>> => {
    const apiUrl = `http://localhost:8082/api/v1/reviews/work/${workId}`
        + `?page=${page}`
        + `&itemsPerPage=${itemsPerPage}`
        + `&searchTerm=${encodeURIComponent(searchQuery)}`
        + `&sortBy=${encodeURIComponent(sortBy)}`
        + `&sortDescending=${sortDescending}`;
    
    if (!workId || !enabled) {
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
        console.error("An error occurred while searching for work reviews", errorData);
        return {
            data: {
                results: [],
                totalCount: 0,
            },
            error: {
                title: "An error occurred while searching for work reviews",
                message: errorData.message,
                code: response.status,
            },
            isLoading: false,
        };
    }

    // Handle success
    const result: PaginatedResults<WorkReviewSearchDTO> = await response.json();

    return {
        data: result,
        error: undefined,
        isLoading: false,
    };
}