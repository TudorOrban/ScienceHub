import { GeneralInfo } from "@/types/infoTypes";
import { Issue, ProjectIssue, WorkIssue } from "@/types/managementTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { WorkSmall } from "@/types/workTypes";
import { constructIdentifier } from "@/utils/constructIdentifier";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export const transformToIssuesInfo = (
    issues: Issue[],
    issuesProjects: ProjectSmall[],
    receivedIssuesProjects: ProjectSmall[],
    issuesWorks: WorkSmall[],
    receivedIssuesWorks: WorkSmall[],
    received?: boolean,
    issueType?: string
): GeneralInfo[] => {
    return issues.map((issue: Issue) => {
        let projectSmall: ProjectSmall | undefined;
        if (
            (issuesProjects && issuesProjects.length > 0) ||
            (received && receivedIssuesProjects && receivedIssuesProjects.length > 0)
        ) {
            projectSmall = !received
                ? issuesProjects.find(
                      (project) =>
                          Number(project.id) === Number((issue as ProjectIssue).projectId || 0)
                  )
                : receivedIssuesProjects.find(
                      (project) =>
                          Number(project.id) === Number((issue as ProjectIssue).projectId || 0)
                  );
        }

        let workSmall: WorkSmall | undefined;
        if (
            (issuesWorks && issuesWorks.length > 0) ||
            (received && receivedIssuesWorks && receivedIssuesWorks.length > 0)
        ) {
            workSmall = !received
                ? issuesWorks.find(
                      (work) =>
                          Number(work.id) === Number((issue as WorkIssue).workId || 0) &&
                          work.workType === (issue as WorkIssue).workType
                  )
                : receivedIssuesWorks.find(
                      (work) =>
                          Number(work.id) === Number((issue as WorkIssue).workId || 0) &&
                          work.workType === (issue as WorkIssue).workType
                  );
        }

        const identifier = constructIdentifier(issue.users || [], issue.teams || []);
        const link =
            issueType === "project_issues"
                ? `/${identifier}/projects/${projectSmall?.name}/management/project-issues/${issue.id}`
                : "work_issueS"
                ? `/${identifier}/management/work-issues/${issue.id}`
                : undefined;

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
            link: link,
            public: issue.public,
        };
    });
};
