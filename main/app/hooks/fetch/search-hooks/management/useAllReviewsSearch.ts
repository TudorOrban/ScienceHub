import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { useUserProjects } from "@/app/hooks/utils/useUserProjects";
import { workTypes } from "@/utils/navItems.config";
import { flattenWorks } from "@/app/hooks/utils/flattenWorks";
import { AllIssuesParams } from "./useAllIssuesSearch";
import { useReviewsSearch } from "./useReviewsSearch";
import { useAllUserWorksSmall } from "@/app/hooks/utils/useAllUserWorksSmall";
import { useObjectsWithUsers } from "../works/useObjectsWithUsers";
import { WorkSmall } from "@/types/workTypes";
import { useAllUserProjectsSmall } from "@/app/hooks/utils/useAllUserProjectsSmall";
import { ProjectSmall } from "@/types/projectTypes";

export const useAllReviewsSearch = ({
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
        enabled: !!currentUserId && activeTab === "Project Reviews",
    });

    const projects = projectsSmall.data[0]?.projects;
    const projectsIds = projects?.map((project) => project.id);
    
    const worksSmall = useAllUserWorksSmall({
        tableRowsIds: [effectiveUserId],
        enabled: !!currentUserId && activeTab === "Work Reviews",
    });

    const works = flattenWorks(worksSmall);
    const worksIds = works?.map((work) => work.id);

    const projectReviewsData = useReviewsSearch({
        extraFilters: {
            users: effectiveUserId,
            object_type: "Project",
            object_id: projectsIds,
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

    const workReviewsData = useReviewsSearch({
        extraFilters: {
            users: effectiveUserId,
            object_type: workTypes,
            object_id: worksIds,
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

    const receivedProjectReviewsData = useReviewsSearch({
        negativeFilters: {
            users: effectiveUserId,
        },
        extraFilters: { object_type: "Project", object_id: projectsIds },
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

    const receivedWorkReviewsData = useReviewsSearch({
        negativeFilters: {
            users: effectiveUserId,
        },
        extraFilters: { object_type: workTypes, object_id: worksIds },
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
        tableName: "review",
        enabled:
            activeTab === "Project Reviews" &&
            activeSelection === "Yours" &&
            !!projectReviewsData,
    });
    const mergedWorkReviewsData = useObjectsWithUsers({
        objectsData: workReviewsData || [],
        tableName: "review",
        enabled:
            activeTab === "Work Reviews" &&
            activeSelection === "Yours" &&
            !!workReviewsData,
    });
    const mergedReceivedProjectReviewsData = useObjectsWithUsers({
        objectsData: receivedProjectReviewsData || [],
        tableName: "review",
        enabled:
            activeTab === "Project Reviews" &&
            activeSelection === "Received" &&
            !!receivedProjectReviewsData,
    });

    const mergedReceivedWorkReviewsData = useObjectsWithUsers({
        objectsData: receivedWorkReviewsData || [],
        tableName: "review",
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
                (review) => review.objectId?.toString() || ""
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
                (review) => review.objectId?.toString() || ""
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
                (review) => review.objectId?.toString() || ""
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
                (review) => review.objectId?.toString() || ""
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
