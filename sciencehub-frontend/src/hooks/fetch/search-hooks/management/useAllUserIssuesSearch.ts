import { workTypes } from "@/src/config/navItems.config";
import { flattenWorks } from "@/src/utils/flattenWorks";
import { useObjectsWithUsers } from "../useObjectsWithUsers";
import { useAllUserWorksSmall } from "@/src/hooks/utils/useAllUserWorksSmall";
import { WorkSmall } from "@/src/types/workTypes";
import { ProjectSmall } from "@/src/types/projectTypes";
import { useAllUserProjectsSmall } from "@/src/hooks/utils/useAllUserProjectsSmall";
import { useProjectIssuesSearch } from "./useProjectIssuesSearch";
import { useWorkIssuesSearch } from "./useWorkIssuesSearch";

export type AllIssuesParams = {
    userId: string | null | undefined;
    activeTab: string;
    activeSelection: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

/**
 * Hook fetching all user's issues and received issues. Used in Workspace Issues page (to be refactored).
 * Executes only one fetch at a time depending on activeTab and activeSelection.
 */
export const useAllUserIssuesSearch = ({
    userId,
    activeTab,
    activeSelection,
    context,
    page,
    itemsPerPage,
}: AllIssuesParams) => {
    // Fetch user projects and works for received
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [userId || ""],
        enabled: !!userId && activeTab === "Project Issues",
    });
    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);

    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [userId || ""],
        enabled: !!userId && activeTab === "Work Issues",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    // Fetch project and work issues
    const projectIssuesData = useProjectIssuesSearch({
        extraFilters: {
            users: userId || "",
            project_id: projectsIds,
        },
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Yours" &&
            !!userId &&
            !!projectsIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const workIssuesData = useWorkIssuesSearch({
        extraFilters: {
            users: userId || "",
            work_type: workTypes,
            work_id: worksIds,
        },
        enabled:
            activeTab === "Work Issues" && activeSelection === "Yours" && !!userId && !!worksIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const receivedProjectIssuesData = useProjectIssuesSearch({
        negativeFilters: {
            users: userId || "",
        },
        extraFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Received" &&
            !!userId &&
            !!projectsIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const receivedWorkIssuesData = useWorkIssuesSearch({
        negativeFilters: {
            users: userId || "",
        },
        extraFilters: { work_type: workTypes, work_id: worksIds },
        enabled:
            activeTab === "Work Issues" && activeSelection === "Received" && !!userId && !!worksIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Merge with users
    const mergedProjectIssuesData = useObjectsWithUsers({
        objectsData: projectIssuesData || [],
        tableName: "project_issue",
        enabled:
            activeTab === "Project Issues" && activeSelection === "Yours" && !!projectIssuesData,
    });
    const mergedWorkIssuesData = useObjectsWithUsers({
        objectsData: workIssuesData || [],
        tableName: "work_issue",
        enabled: activeTab === "Work Issues" && activeSelection === "Yours" && !!workIssuesData,
    });
    const mergedReceivedProjectIssuesData = useObjectsWithUsers({
        objectsData: receivedProjectIssuesData || [],
        tableName: "project_issue",
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Received" &&
            !!receivedProjectIssuesData,
    });

    const mergedReceivedWorkIssuesData = useObjectsWithUsers({
        objectsData: receivedWorkIssuesData || [],
        tableName: "work_issue",
        enabled:
            activeTab === "Work Issues" &&
            activeSelection === "Received" &&
            !!receivedWorkIssuesData,
    });

    // Keep fetched projects and works for display
    let issuesProjects: ProjectSmall[] = [];
    if (projectIssuesData && projects) {
        const issuesProjectsIds =
            projectIssuesData?.data.map((issue) => issue.projectId?.toString() || "") || [];
        issuesProjects =
            projects.filter((project) => issuesProjectsIds.includes(project.id.toString() || "")) ||
            [];
    }

    let issuesWorks: WorkSmall[] = [];
    if (workIssuesData && works) {
        const issuesWorksIds =
            workIssuesData?.data.map((issue) => issue.workId?.toString() || "") || [];
        issuesWorks =
            works.filter(
                (work) =>
                    workTypes.includes(work.workType || "") &&
                    issuesWorksIds.includes(work.id.toString() || "")
            ) || [];
    }

    let receivedIssuesProjects: ProjectSmall[] = [];
    if (receivedProjectIssuesData && projects) {
        const receivedIssuesProjectsIds =
            receivedProjectIssuesData?.data.map((issue) => issue.projectId?.toString() || "") || [];
        receivedIssuesProjects =
            projects.filter((project) =>
                receivedIssuesProjectsIds.includes(project.id.toString() || "")
            ) || [];
    }

    let receivedIssuesWorks: WorkSmall[] = [];
    if (receivedWorkIssuesData && works) {
        const receivedIssuesWorksIds =
            receivedWorkIssuesData?.data.map((issue) => issue.workId?.toString() || "") || [];
        receivedIssuesWorks =
            works.filter(
                (work) =>
                    workTypes.includes(work.workType || "") &&
                    receivedIssuesWorksIds.includes(work.id.toString() || "")
            ) || [];
    }

    return {
        mergedProjectIssuesData,
        mergedWorkIssuesData,
        mergedReceivedProjectIssuesData,
        mergedReceivedWorkIssuesData,
        issuesProjects,
        issuesWorks,
        receivedIssuesProjects,
        receivedIssuesWorks,
    };
};
