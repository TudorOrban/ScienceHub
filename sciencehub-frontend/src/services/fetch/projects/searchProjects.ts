import { ProjectSearchDTO } from "@/src/types/projectTypes";
import { PaginatedResults, Result } from "@/src/types/searchTypes";
import { SmallSearchOptionsNew } from "@/src/types/utilsTypes";



export const searchProjects = async ({
    entityId: userId,
    enabled,
    searchQuery = '',
    page = 1,
    itemsPerPage = 10,
    sortBy = 'Name',
    sortDescending = false
}: SmallSearchOptionsNew): Promise<Result<PaginatedResults<ProjectSearchDTO>>> => {
    const apiUrl = `http://localhost:8082/api/v1/projects/user/${userId}`
        + `?page=${page}`
        + `&itemsPerPage=${itemsPerPage}`
        + `&searchTerm=${encodeURIComponent(searchQuery)}`
        + `&sortBy=${encodeURIComponent(sortBy)}`
        + `&sortDescending=${sortDescending}`;
    
    if (!userId || !enabled) {
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
        console.error("An error occurred while searching for projects", errorData);
        return {
            data: {
                results: [],
                totalCount: 0,
            },
            error: {
                title: "An error occurred while searching for projects",
                message: errorData.message,
                code: response.status,
            },
            isLoading: false,
        };
    }

    // Handle success
    const result: PaginatedResults<ProjectSearchDTO> = await response.json();

    return {
        data: result,
        error: undefined,
        isLoading: false,
    };
}