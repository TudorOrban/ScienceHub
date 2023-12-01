import { ProjectSmall } from "@/types/projectTypes";

// Helper function for user filter logic
export const updateProjectFilter = (
    projectFilterOn: boolean,
    projects: ProjectSmall[],
    filters: Record<string, any>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
    if (projectFilterOn && projects.length > 0) {
        const filterProjects: string[] = filters.hasOwnProperty("projects")
            ? filters.projects
            : [];
        const projectsIds = projects.map((project) => project.id.toString());

        if (projectsIds && filterProjects !== projectsIds) {
            const newFilters: Record<string, string[]> = {
                ...filters,
                projects: projectsIds,
            };
            setFilters(newFilters);
        }
    } else {
        const { projects, ...newFilters } = filters;
        setFilters(newFilters);
    }
};
