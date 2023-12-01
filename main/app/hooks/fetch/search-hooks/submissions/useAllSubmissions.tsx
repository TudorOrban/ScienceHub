import { useUserId } from "@/app/contexts/general/UserIdContext";
import { useProjectSubmissionsSearch } from "./useProjectSubmissionsSearch";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { useWorkSubmissionsSearch } from "./useWorkSubmissionsSearch";
import { useAllUserProjectsSmall } from "@/app/hooks/utils/useAllUserProjectsSmall";
import { useAllUserWorksSmall } from "@/app/hooks/utils/useAllUserWorksSmall";
import { flattenWorks } from "@/app/hooks/utils/flattenWorks";
import { ProjectSmall } from "@/types/projectTypes";
import { WorkSmall } from "@/types/workTypes";
import { workTypes } from "@/utils/navItems.config";

export type AllSubmissionsParams = {
    activeTab: string;
    activeSelection: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllSubmissionsSearch = ({
    activeTab,
    activeSelection,
    context,
    page,
    itemsPerPage,
}: AllSubmissionsParams) => {
    // Hooks
    const currentUserId = useUserId();
    const effectiveUserId =
        currentUserId || "794f5523-2fa2-4e22-9f2f-8234ac15829a";

    // Fetch user projects and works for submission requests
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [effectiveUserId],
        enabled: !!currentUserId && activeTab === "Project Submissions",
    });
    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);

    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [effectiveUserId],
        enabled: !!currentUserId && activeTab === "Work Submissions",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    // Fetch project and work submissions
    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: { users: effectiveUserId },
        tableFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Submissions" &&
            activeSelection === "Yours" &&
            !!currentUserId &&
            !!projectsIds,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const workSubmissionsData = useWorkSubmissionsSearch({
        extraFilters: { users: effectiveUserId, work_id: worksIds },
        enabled:
            activeTab === "Work Submissions" &&
            activeSelection === "Yours" &&
            !!currentUserId &&
            !!worksIds,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const projectSubmissionRequestsData = useProjectSubmissionsSearch({
        negativeFilters: {
            users: effectiveUserId,
        },
        tableFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Submissions" &&
            activeSelection === "Received" &&
            !!currentUserId &&
            !!projectsIds,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const worksSubmissionRequestsData = useWorkSubmissionsSearch({
        negativeFilters: {
            users: effectiveUserId,
        },
        extraFilters: {
            work_id: worksIds,
        },
        enabled:
            activeTab === "Work Submissions" &&
            activeSelection === "Received" &&
            !!currentUserId &&
            !!worksIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const mergedProjectSubmissions = useObjectsWithUsers({
        objectsData: projectSubmissionsData || [],
        tableName: "project_submission",
        enabled:
            activeTab === "Project Submissions" &&
            activeSelection === "Yours" &&
            !!projectSubmissionsData,
    });
    const mergedWorkSubmissions = useObjectsWithUsers({
        objectsData: workSubmissionsData || [],
        tableName: "work_submission",
        enabled:
            activeTab === "Work Submissions" &&
            activeSelection === "Yours" &&
            !!workSubmissionsData,
    });
    const mergedProjectSubmissionRequests = useObjectsWithUsers({
        objectsData: projectSubmissionRequestsData || [],
        tableName: "project_submission",
        enabled:
            activeTab === "Project Submissions" &&
            activeSelection === "Received" &&
            !!projectSubmissionRequestsData,
    });

    const mergedWorkSubmissionRequests = useObjectsWithUsers({
        objectsData: worksSubmissionRequestsData || [],
        tableName: "work_submission",
        enabled:
            activeTab === "Work Submissions" &&
            activeSelection === "Received" &&
            !!worksSubmissionRequestsData,
    });

    // Keep fetched projects and works for display
    let submissionsProjects: ProjectSmall[] = [];
    if (projectSubmissionsData && projects) {
        const submissionsProjectsIds =
            projectSubmissionsData?.data.map(
                (submission) => submission.projectId?.toString() || ""
            ) || [];
        submissionsProjects =
            projects.filter((project) =>
                submissionsProjectsIds.includes(project.id.toString() || "")
            ) || [];
    }

    let submissionsWorks: WorkSmall[] = [];
    if (workSubmissionsData && works) {
        const submissionsWorksIds =
            workSubmissionsData?.data.map(
                (submission) => submission.workId?.toString() || ""
            ) || [];
        submissionsWorks =
            works.filter(
                (work) =>
                    workTypes.includes(work.workType || "") &&
                    submissionsWorksIds.includes(work.id.toString() || "")
            ) || [];
    }

    let submissionRequestsProjects: ProjectSmall[] = [];
    if (projectSubmissionRequestsData && projects) {
        const submissionRequestsProjectsIds =
            projectSubmissionRequestsData?.data.map(
                (submission) => submission.projectId?.toString() || ""
            ) || [];
        submissionRequestsProjects =
            projects.filter((project) =>
                submissionRequestsProjectsIds.includes(
                    project.id.toString() || ""
                )
            ) || [];
    }

    let submissionRequestsWorks: WorkSmall[] = [];
    if (submissionRequestsWorks && works) {
        const submissionRequestsWorksIds =
            worksSubmissionRequestsData?.data.map(
                (submission) => submission.workId?.toString() || ""
            ) || [];
        submissionRequestsWorks =
            works.filter(
                (work) =>
                    workTypes.includes(work.workType || "") &&
                    submissionRequestsWorksIds.includes(
                        work.id.toString() || ""
                    )
            ) || [];
    }

    return {
        mergedProjectSubmissions,
        mergedWorkSubmissions,
        mergedProjectSubmissionRequests,
        mergedWorkSubmissionRequests,
        submissionsProjects,
        submissionsWorks,
        submissionRequestsProjects,
        submissionRequestsWorks,
    };
};
