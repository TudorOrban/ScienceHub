import { ProjectSearchDTO } from "@/types/projectTypes";
import { PaginatedResults, Result } from "@/types/searchTypes";
import { SmallSearchOptionsNew } from "@/types/utilsTypes";



export const fetchProjectsSearch = async ({
    userId,
    enabled,
    page,
    itemsPerPage,
}: SmallSearchOptionsNew): Promise<Result<PaginatedResults<ProjectSearchDTO>>> => {
    const apiUrl = `http://localhost:5183/api/v1/projects/user/${userId}`;
    
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
    const result: PaginatedResults<ProjectSearchDTO> = await response.json();
    console.log("Projects deserialized: ", result);

    return {
        data: result,
        error: undefined,
        isLoading: false,
    };
}