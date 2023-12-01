import { Work } from "@/types/workTypes";
import { getObjectNames } from "../utils/getObjectNames";
import { workTypeIconMap } from "@/components/elements/SmallWorkCard";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { ProjectSmall } from "@/types/projectTypes";
import { GeneralInfo } from "@/types/infoTypes";

export const transformToWorksInfo = (
    works: Work[],
    worksProjects: ProjectSmall[],
    workType: string,
    context?: string
): GeneralInfo[] => {
    return works.map((work: Work) => {
        let projectSmall: ProjectSmall | undefined;
        if (worksProjects && worksProjects.length > 0) {
            projectSmall = worksProjects.find(
                (project) =>
                    project.id.toString() ===
                    (work as any).projects[0]?.id.toString()
            );
        }

        const name = getObjectNames({ tableName: workType });
        const icon = workTypeIconMap(name?.label || "") || faQuestion;

        const link =
            context === "Project General"
                ? `${workType}/${work.id}`
                : `/works/${getObjectNames({ tableName: workType })?.linkName}/${work.id}`;

        return {
            id: work.id,
            itemType: workType,
            icon: icon.icon,
            iconColor: icon.color,
            title: work.title,
            createdAt: work.createdAt,
            description: work.description,
            users: work.users,
            project: projectSmall,
            link: link,
            public: work.public,
        };
    });
};
