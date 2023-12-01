import { GeneralInfo } from "@/types/infoTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { ProjectSubmission, Submission, WorkSubmission } from "@/types/versionControlTypes";
import { WorkSmall } from "@/types/workTypes";
import { faPaste } from "@fortawesome/free-solid-svg-icons";

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
        let projectSmall: ProjectSmall | undefined;
        if (
            (submissionsProjects && submissionsProjects.length > 0) ||
            (received &&
                submissionRequestsProjects &&
                submissionRequestsProjects.length > 0)
        ) {
            projectSmall = !received
                ? submissionsProjects.find(
                      (project) =>
                          Number(project.id) ===
                          Number(
                              (submission as ProjectSubmission).projectId ||
                                  0
                          )
                  )
                : submissionRequestsProjects.find(
                      (project) =>
                          Number(project.id) ===
                          Number(
                              (submission as ProjectSubmission).projectId ||
                                  0
                          )
                  );
        }
        
        let workSmall: WorkSmall | undefined;
        if (
            (submissionsWorks && submissionsWorks.length > 0) ||
            (received &&
                submissionRequestsWorks &&
                submissionRequestsWorks.length > 0)
        ) {
            workSmall = !received
                ? submissionsWorks.find(
                      (work) =>
                          Number(work.id) ===
                          Number((submission as WorkSubmission).workId || 0)
                  )
                : submissionRequestsWorks.find(
                      (work) =>
                          Number(work.id) ===
                          Number((submission as WorkSubmission).workId || 0)
                  );
        }

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
            link: `/workspace/submissions/${submission.id}`,
            public: submission.public,
        };
    });
};