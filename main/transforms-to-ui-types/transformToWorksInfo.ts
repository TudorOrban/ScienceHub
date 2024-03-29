import { Work } from "@/types/workTypes";
import { ProjectMedium } from "@/types/projectTypes";
import { GeneralInfo } from "@/types/infoTypes";
import { transformWorkToWorkInfo } from "./transformWorkToWorkInfo";

/**
 * Function for transforming work to GeneralInfo
 */
export const transformToWorksInfo = (
    works: Work[],
    worksProjects: ProjectMedium[],
): GeneralInfo[] => {
    return works.map((work: Work) => {
        // Attach project to work
        let projectMedium: ProjectMedium | undefined;
        if (worksProjects && worksProjects.length > 0) {
            projectMedium = worksProjects.find(
                (project) =>
                    project.id.toString() ===
                    (work as Work).projects?.[0]?.id.toString()
            );
        }

        return transformWorkToWorkInfo(work, projectMedium);
    });
};
