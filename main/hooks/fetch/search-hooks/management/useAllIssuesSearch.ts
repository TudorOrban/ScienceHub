import { useUserId } from "@/contexts/current-user/UserIdContext";
import { workTypes } from "@/config/navItems.config";
import { flattenWorks } from "@/hooks/utils/flattenWorks";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { useAllUserWorksSmall } from "@/hooks/utils/useAllUserWorksSmall";
import { WorkSmall } from "@/types/workTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";
import { useProjectIssuesSearch } from "./useProjectIssuesSearch";
import { useWorkIssuesSearch } from "./useWorkIssuesSearch";

export type AllIssuesParams = {
    activeTab: string;
    activeSelection: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

export const useAllIssuesSearch = ({
    activeTab,
    activeSelection,
    context,
    page,
    itemsPerPage,
}: AllIssuesParams) => {
    const currentUserId = useUserId();

    // Fetch user projects and works for received
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [currentUserId || ""],
        enabled: !!currentUserId && activeTab === "Project Issues",
    });
    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);

    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [currentUserId || ""],
        enabled: !!currentUserId && activeTab === "Work Issues",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    // Fetch project and work issues
    const projectIssuesData = useProjectIssuesSearch({
        extraFilters: {
            users: currentUserId || "",
            project_id: projectsIds,
        },
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Yours" &&
            !!currentUserId &&
            !!projectsIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const workIssuesData = useWorkIssuesSearch({
        extraFilters: {
            users: currentUserId || "",
            work_type: workTypes,
            work_id: worksIds,
        },
        enabled:
            activeTab === "Work Issues" &&
            activeSelection === "Yours" &&
            !!currentUserId &&
            !!worksIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const receivedProjectIssuesData = useProjectIssuesSearch({
        negativeFilters: {
            users: currentUserId || "",
        },
        extraFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Received" &&
            !!currentUserId &&
            !!projectsIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const receivedWorkIssuesData = useWorkIssuesSearch({
        negativeFilters: {
            users: currentUserId || "",
        },
        extraFilters: { work_type: workTypes, work_id: worksIds },
        enabled:
            activeTab === "Work Issues" &&
            activeSelection === "Received" &&
            !!currentUserId &&
            !!worksIds,
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
            activeTab === "Project Issues" &&
            activeSelection === "Yours" &&
            !!projectIssuesData,
    });
    const mergedWorkIssuesData = useObjectsWithUsers({
        objectsData: workIssuesData || [],
        tableName: "work_issue",
        enabled:
            activeTab === "Work Issues" &&
            activeSelection === "Yours" &&
            !!workIssuesData,
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
            projectIssuesData?.data.map(
                (issue) => issue.projectId?.toString() || ""
            ) || [];
        issuesProjects =
            projects.filter((project) =>
                issuesProjectsIds.includes(project.id.toString() || "")
            ) || [];
    }

    let issuesWorks: WorkSmall[] = [];
    if (workIssuesData && works) {
        const issuesWorksIds =
            workIssuesData?.data.map(
                (issue) => issue.workId?.toString() || ""
            ) || [];
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
            receivedProjectIssuesData?.data.map(
                (issue) => issue.projectId?.toString() || ""
            ) || [];
        receivedIssuesProjects =
            projects.filter((project) =>
                receivedIssuesProjectsIds.includes(project.id.toString() || "")
            ) || [];
    }

    let receivedIssuesWorks: WorkSmall[] = [];
    if (receivedWorkIssuesData && works) {
        const receivedIssuesWorksIds =
            receivedWorkIssuesData?.data.map(
                (issue) => issue.workId?.toString() || ""
            ) || [];
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
