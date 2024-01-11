import { useProjectSubmissionsSearch } from "./useProjectSubmissionsSearch";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { useWorkSubmissionsSearch } from "./useWorkSubmissionsSearch";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";
import { useAllUserWorksSmall } from "@/hooks/utils/useAllUserWorksSmall";
import { flattenWorks } from "@/hooks/utils/flattenWorks";
import { ProjectSmall } from "@/types/projectTypes";
import { WorkSmall } from "@/types/workTypes";
import { workTypes } from "@/config/navItems.config";

export type AllSubmissionsParams = {
    userId?: string | null | undefined;
    activeTab: string;
    activeSelection: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllSubmissionsSearch = ({
    userId,
    activeTab,
    activeSelection,
    context,
    page,
    itemsPerPage,
}: AllSubmissionsParams) => {
    // Fetch user projects and works for submission requests
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [userId || ""],
        enabled: !!userId && activeTab === "Project Submissions",
    });
    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);

    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [userId || ""],
        enabled: !!userId && activeTab === "Work Submissions",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    // Fetch project and work submissions
    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: { users: userId || "" },
        tableFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Submissions" &&
            activeSelection === "Yours" &&
            !!userId &&
            !!projectsIds,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const workSubmissionsData = useWorkSubmissionsSearch({
        extraFilters: { users: userId || "", work_id: worksIds },
        enabled:
            activeTab === "Work Submissions" &&
            activeSelection === "Yours" &&
            !!userId &&
            !!worksIds,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const projectSubmissionRequestsData = useProjectSubmissionsSearch({
        negativeFilters: {
            users: userId || "",
        },
        tableFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Submissions" &&
            activeSelection === "Received" &&
            !!userId &&
            !!projectsIds,
        context: "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const worksSubmissionRequestsData = useWorkSubmissionsSearch({
        negativeFilters: {
            users: userId || "",
        },
        extraFilters: {
            work_id: worksIds,
        },
        enabled:
            activeTab === "Work Submissions" &&
            activeSelection === "Received" &&
            !!userId &&
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
