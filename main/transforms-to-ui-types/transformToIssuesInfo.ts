import { GeneralInfo } from "@/types/infoTypes";
import { Issue } from "@/types/managementTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { WorkSmall } from "@/types/workTypes";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export const transformToIssuesInfo = (
    issues: Issue[],
    issuesProjects: ProjectSmall[],
    receivedIssuesProjects: ProjectSmall[],
    issuesWorks: WorkSmall[],
    receivedIssuesWorks: WorkSmall[],
    received?: boolean
): GeneralInfo[] => {

    return issues.map((issue: Issue) => {
        let projectSmall: ProjectSmall | undefined;
        if (
            (issuesProjects && issuesProjects.length > 0) ||
            (received &&
                receivedIssuesProjects &&
                receivedIssuesProjects.length > 0)
        ) {
            projectSmall = !received
                ? issuesProjects.find(
                      (project) =>
                          Number(project.id) === Number(issue.objectId || 0)
                  )
                : receivedIssuesProjects.find(
                      (project) =>
                          Number(project.id) === Number(issue.objectId || 0)
                  );
        }

        let workSmall: WorkSmall | undefined;
        if (
            (issuesWorks && issuesWorks.length > 0) ||
            (received &&
                receivedIssuesWorks &&
                receivedIssuesWorks.length > 0)
        ) {
            workSmall = !received
                ? issuesWorks.find(
                      (work) =>
                          Number(work.id) === Number(issue.objectId || 0)
                  )
                : receivedIssuesWorks.find(
                      (work) =>
                          Number(work.id) === Number(issue.objectId || 0)
                  );
        }

        return {
            id: issue.id,
            itemType: "issues",
            icon: faExclamationCircle,
            title: issue.title,
            createdAt: issue.createdAt,
            description: issue.description,
            users: issue.users,
            project: projectSmall,
            work: workSmall,
            link: `/workspace/issues/${issue.id}`,
            public: issue.public,
        };
    });
};