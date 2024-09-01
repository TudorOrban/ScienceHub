import { ProjectSmall } from "@/src/types/projectTypes";

// Function to update the project filter
export const updateProjectFilter = (
    projectFilterOn: boolean,
    projects: ProjectSmall[],
    filters: Record<string, any>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    mode?: "Research" | "Management" | "Community"
) => {
    // Handle different query key for Management features
    const projectQueryKey = mode === "Management" ? "project_id" : "projects";
    
    if (projectFilterOn) {
        // Get existing project filters
        const filterProjects: number[] = filters.hasOwnProperty(projectQueryKey)
            ? filters[projectQueryKey]
            : [];
        const projectsIds = projects.map((project) => project.id);

        // Check if the projects list is empty or the filters need updating
        if (projects.length === 0 || filterProjects !== projectsIds) {
            const newFilters = projects.length === 0 
                ? {...filters}
                : {...filters, [projectQueryKey]: projectsIds};
            
            // Remove the key if there are no projects
            if (projects.length === 0) {
                delete newFilters[projectQueryKey];
            }

            setFilters(newFilters);
        }
    } else {
        // Clear project filter
        const {[projectQueryKey]: removedKey, ...newFilters} = filters;
        setFilters(newFilters);
    }
};

