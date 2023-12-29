import { useUserId } from "@/contexts/current-user/UserIdContext";
import { workTypes } from "@/config/navItems.config";
import { flattenWorks } from "@/hooks/utils/flattenWorks";
import { AllIssuesParams } from "./useAllIssuesSearch";
import { useAllUserWorksSmall } from "@/hooks/utils/useAllUserWorksSmall";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { WorkSmall } from "@/types/workTypes";
import { useAllUserProjectsSmall } from "@/hooks/utils/useAllUserProjectsSmall";
import { ProjectSmall } from "@/types/projectTypes";
import { useProjectReviewsSearch } from "./useProjectReviewsSearch";
import { useWorkReviewsSearch } from "./useWorkReviewsSearch";

export const useAllReviewsSearch = ({
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
        enabled: !!currentUserId && activeTab === "Project Reviews",
    });

    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);
    
    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [currentUserId || ""],
        enabled: !!currentUserId && activeTab === "Work Reviews",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    const projectReviewsData = useProjectReviewsSearch({
        extraFilters: {
            users: currentUserId || "",
            project_id: projectsIds,
        },
        enabled:
            activeTab === "Project Reviews" &&
            activeSelection === "Yours" &&
            !!currentUserId &&
            !!projectsIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const workReviewsData = useWorkReviewsSearch({
        extraFilters: {
            users: currentUserId || "",
            work_type: workTypes,
            work_id: worksIds,
        },
        enabled:
            activeTab === "Work Reviews" &&
            activeSelection === "Yours" &&
            !!currentUserId &&
            !!worksIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    const receivedProjectReviewsData = useProjectReviewsSearch({
        negativeFilters: {
            users: currentUserId || "",
        },
        extraFilters: { project_id: projectsIds },
        enabled:
            activeTab === "Project Reviews" &&
            activeSelection === "Received" &&
            !!currentUserId &&
            !!projectsIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });
    
    
    const receivedWorkReviewsData = useWorkReviewsSearch({
        negativeFilters: {
            users: currentUserId || "",
        },
        extraFilters: { work_type: workTypes, work_id: worksIds },
        enabled:
            activeTab === "Work Reviews" &&
            activeSelection === "Received" &&
            !!currentUserId &&
            !!worksIds,
        context: context || "Workspace General",
        page: page,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Merge with users
    const mergedProjectReviewsData = useObjectsWithUsers({
        objectsData: projectReviewsData || [],
        tableName: "project_review",
        enabled:
            activeTab === "Project Reviews" &&
            activeSelection === "Yours" &&
            !!projectReviewsData,
    });
    const mergedWorkReviewsData = useObjectsWithUsers({
        objectsData: workReviewsData || [],
        tableName: "work_review",
        enabled:
            activeTab === "Work Reviews" &&
            activeSelection === "Yours" &&
            !!workReviewsData,
    });
    const mergedReceivedProjectReviewsData = useObjectsWithUsers({
        objectsData: receivedProjectReviewsData || [],
        tableName: "project_review",
        enabled:
            activeTab === "Project Reviews" &&
            activeSelection === "Received" &&
            !!receivedProjectReviewsData,
    });

    const mergedReceivedWorkReviewsData = useObjectsWithUsers({
        objectsData: receivedWorkReviewsData || [],
        tableName: "work_review",
        enabled:
            activeTab === "Work Reviews" &&
            activeSelection === "Received" &&
            !!receivedWorkReviewsData,
    });

    // Keep fetched projects and works for display
    let reviewsProjects: ProjectSmall[] = [];
    if (projectReviewsData && projects) {
        const reviewsProjectsIds =
            projectReviewsData?.data.map(
                (review) => review.projectId?.toString() || ""
            ) || [];
        reviewsProjects =
            projects.filter((project) =>
                reviewsProjectsIds.includes(project.id.toString() || "")
            ) || [];
    }

    let reviewsWorks: WorkSmall[] = [];
    if (workReviewsData && works) {
        const reviewsWorksIds =
            workReviewsData?.data.map(
                (review) => review.workId?.toString() || ""
            ) || [];
        reviewsWorks =
            works.filter(
                (work) =>
                    workTypes.includes(work.workType || "") &&
                    reviewsWorksIds.includes(work.id.toString() || "")
            ) || [];
    }

    let receivedReviewsProjects: ProjectSmall[] = [];
    if (receivedProjectReviewsData && projects) {
        const receivedReviewsProjectsIds =
            receivedProjectReviewsData?.data.map(
                (review) => review.projectId?.toString() || ""
            ) || [];
        receivedReviewsProjects =
            projects.filter((project) =>
                receivedReviewsProjectsIds.includes(project.id.toString() || "")
            ) || [];
    }

    let receivedReviewsWorks: WorkSmall[] = [];
    if (receivedWorkReviewsData && works) {
        const receivedReviewsWorksIds =
            receivedWorkReviewsData?.data.map(
                (review) => review.workId?.toString() || ""
            ) || [];
        receivedReviewsWorks =
            works.filter(
                (work) =>
                    workTypes.includes(work.workType || "") &&
                    receivedReviewsWorksIds.includes(work.id.toString() || "")
            ) || [];
    }

    return {
        mergedProjectReviewsData,
        mergedWorkReviewsData,
        mergedReceivedProjectReviewsData,
        mergedReceivedWorkReviewsData,
        reviewsProjects,
        reviewsWorks,
        receivedReviewsProjects,
        receivedReviewsWorks,
    };
};
