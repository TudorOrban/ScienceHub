import { GeneralInfo } from "@/src/types/infoTypes";
import { ProjectSmall } from "@/src/types/projectTypes";
import { ProjectSubmission, Submission, WorkSubmission } from "@/src/types/versionControlTypes";
import { WorkSmall } from "@/src/types/workTypes";
import { constructIdentifier } from "@/src/utils/constructIdentifier";
import { faPaste } from "@fortawesome/free-solid-svg-icons";

/**
 * Function for transforming submission to GeneralInfo
 */
export const transformToSubmissionsInfo = (
    submissions: Submission[],
    submissionsProjects: ProjectSmall[],
    submissionRequestsProjects: ProjectSmall[],
    submissionsWorks: WorkSmall[],
    submissionRequestsWorks: WorkSmall[],
    received?: boolean,
    submissionType?: string
): GeneralInfo[] => {
    return submissions.map((submission: Submission) => {
        // Attach project/work to submission
        let projectSmall: ProjectSmall | undefined;
        if (
            (submissionsProjects && submissionsProjects.length > 0) ||
            (received && submissionRequestsProjects && submissionRequestsProjects.length > 0)
        ) {
            projectSmall = !received
                ? submissionsProjects.find(
                      (project) =>
                          Number(project.id) ===
                          Number((submission as ProjectSubmission).projectId || 0)
                  )
                : submissionRequestsProjects.find(
                      (project) =>
                          Number(project.id) ===
                          Number((submission as ProjectSubmission).projectId || 0)
                  );
        }

        let workSmall: WorkSmall | undefined;
        if (
            (submissionsWorks && submissionsWorks.length > 0) ||
            (received && submissionRequestsWorks && submissionRequestsWorks.length > 0)
        ) {
            workSmall = !received
                ? submissionsWorks.find(
                      (work) =>
                          Number(work.id) === Number((submission as WorkSubmission).workId || 0) &&
                          work.workType === (submission as WorkSubmission).workType
                  )
                : submissionRequestsWorks.find(
                      (work) =>
                          Number(work.id) === Number((submission as WorkSubmission).workId || 0) &&
                          work.workType === (submission as WorkSubmission).workType
                  );
        }

        // Construct link
        const identifier = constructIdentifier(submission.users || [], submission.teams || []);
        const link =
            submissionType === "project_submissions"
                ? `/${identifier}/projects/${projectSmall?.name}/management/project-submissions/${submission.id}`
                : "work_submissions"
                ? `/${identifier}/management/work-submissions/${submission.id}`
                : undefined;

        return {
            id: submission.id,
            itemType: submissionType,
            icon: faPaste,
            title: submission.title,
            createdAt: submission.createdAt,
            description: submission.description,
            users: submission.users,
            project: projectSmall,
            work: workSmall,
            link: link,
            public: submission.public,
        };
    });
};
