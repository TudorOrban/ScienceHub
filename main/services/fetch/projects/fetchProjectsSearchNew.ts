import { ProjectSearchDTO } from "@/types/projectTypes";
import { Result } from "@/types/searchTypes";
import { SmallSearchOptionsNew } from "@/types/utilsTypes";



export const fetchProjectsSearch = async ({
    userId,
    enabled,
    page,
    itemsPerPage,
}: SmallSearchOptionsNew): Promise<Result<ProjectSearchDTO[]>> => {
    const apiUrl = `http://localhost:5183/api/v1/projects/user/${userId}`;
    
    if (!userId || !enabled) {
        return {
            data: [],
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
            data: [],
            error: {
                title: "An error occurred while creating the issue",
                message: errorData.message,
                code: response.status,
            },
            isLoading: false,
        };
    }

    // Handle success
    const projects: ProjectSearchDTO[] = await response.json();

    return {
        data: projects,
        error: undefined,
        isLoading: false,
    };
}