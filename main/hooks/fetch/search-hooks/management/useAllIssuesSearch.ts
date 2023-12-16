import { useIssuesSearch } from "./useIssuesSearch";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUserProjects } from "@/hooks/utils/useUserProjects";
import { workTypes } from "@/config/navItems.config";
import { flattenWorks } from "@/hooks/utils/flattenWorks";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { useAllUserWorksSmall } from "@/hooks/utils/useAllUserWorksSmall";
import { off } from "process";
import { WorkSmall } from "@/types/workTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";

export type AllIssuesParams = {
    activeTab: string;
    activeSelection: string;
    context?: string;
    page?: number;
    itemsPerPage?: number;
};

// Note: As opposed to submissions, the issues and reviews store associated project/work as json
export const useAllIssuesSearch = ({
    activeTab,
    activeSelection,
    context,
    page,
    itemsPerPage,
}: AllIssuesParams) => {
    const currentUserId = useUserId();
    const effectiveUserId =
        currentUserId || "794f5523-2fa2-4e22-9f2f-8234ac15829a";

    // Fetch user projects and works for received
    const projectsSmall = useAllUserProjectsSmall({
        tableRowsIds: [effectiveUserId],
        enabled: !!currentUserId && activeTab === "Project Issues",
    });
    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);

    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [effectiveUserId],
        enabled: !!currentUserId && activeTab === "Work Issues",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    // Fetch project and work issues
    const projectIssuesData = useIssuesSearch({
        extraFilters: {
            users: effectiveUserId,
            object_type: "Project",
            object_id: projectsIds,
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

    const workIssuesData = useIssuesSearch({
        extraFilters: {
            users: effectiveUserId,
            object_type: workTypes,
            object_id: worksIds,
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

    const receivedProjectIssuesData = useIssuesSearch({
        negativeFilters: {
            users: effectiveUserId,
        },
        extraFilters: { object_type: "Project", object_id: projectsIds },
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

    const receivedWorkIssuesData = useIssuesSearch({
        negativeFilters: {
            users: effectiveUserId,
        },
        extraFilters: { object_type: workTypes, object_id: worksIds },
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
        tableName: "issue",
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Yours" &&
            !!projectIssuesData,
    });
    const mergedWorkIssuesData = useObjectsWithUsers({
        objectsData: workIssuesData || [],
        tableName: "issue",
        enabled:
            activeTab === "Work Issues" &&
            activeSelection === "Yours" &&
            !!workIssuesData,
    });
    const mergedReceivedProjectIssuesData = useObjectsWithUsers({
        objectsData: receivedProjectIssuesData || [],
        tableName: "issue",
        enabled:
            activeTab === "Project Issues" &&
            activeSelection === "Received" &&
            !!receivedProjectIssuesData,
    });

    const mergedReceivedWorkIssuesData = useObjectsWithUsers({
        objectsData: receivedWorkIssuesData || [],
        tableName: "issue",
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
                (issue) => issue.objectId?.toString() || ""
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
                (issue) => issue.objectId?.toString() || ""
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
                (issue) => issue.objectId?.toString() || ""
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
                (issue) => issue.objectId?.toString() || ""
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
