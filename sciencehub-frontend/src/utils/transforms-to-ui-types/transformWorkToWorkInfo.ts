import { workTypeIconMap } from "@/src/components/cards/small-cards/SmallWorkCard";
import { getObjectNames } from "@/src/config/getObjectNames";
import { ProjectMedium } from "@/src/types/projectTypes";
import { Work } from "@/src/types/workTypes";
import { constructIdentifier } from "@/src/utils/constructIdentifier";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

/**
 * Function for transforming work to WorkInfo
 */
export const transformWorkToWorkInfo = (work: Work, project: ProjectMedium | undefined) => {
    // TODO: Replace with link column in work tables
    // Get work names and icons
    const workTypeNames = getObjectNames({ label: work.workType });
    const icon = workTypeIconMap(workTypeNames?.label || "") || faQuestion;

    // Construct link based on whether project is defined
    const identifier = constructIdentifier(work.users || [], work.teams || []);
    const projectIdentifier = constructIdentifier(project?.users || [], project?.teams || []);
    const workTypeLinkName = workTypeNames?.linkName;
    const link =
        project?.name && projectIdentifier
            ? `/${projectIdentifier}/projects/${project?.name}/research/${workTypeLinkName}/${work.id}`
            : !!identifier
            ? `/${identifier}/research/${workTypeLinkName}/${work.id}`
            : undefined;

    return {
        id: work.id,
        itemType: work.workType,
        icon: icon.icon,
        iconColor: icon.color,
        title: work.title,
        createdAt: work.createdAt,
        description: work.description,
        users: work.users,
        project: project,
        link: link,
        public: work.public,
    };
};
