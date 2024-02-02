import { GeneralInfo } from "@/types/infoTypes";
import { ProjectReview, Review, WorkReview } from "@/types/managementTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { WorkSmall } from "@/types/workTypes";
import { constructIdentifier } from "@/utils/constructIdentifier";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

/**
 * Function for transforming review to GeneralInfo
 */
export const transformToReviewsInfo = (
    reviewsData: Review[],
    reviewsProjects: ProjectSmall[],
    receivedReviewsProjects: ProjectSmall[],
    reviewsWorks: WorkSmall[],
    receivedReviewsWorks: WorkSmall[],
    received?: boolean,
    reviewType?: string
): GeneralInfo[] => {
    return reviewsData.map((review: Review) => {
        // Attach project/work to review
        let projectSmall: ProjectSmall | undefined;
        if (
            (reviewsProjects && reviewsProjects.length > 0) ||
            (received && receivedReviewsProjects && receivedReviewsProjects.length > 0)
        ) {
            projectSmall = !received
                ? reviewsProjects.find(
                      (project) =>
                          Number(project.id) === Number((review as ProjectReview).projectId || 0)
                  )
                : receivedReviewsProjects.find(
                      (project) =>
                          Number(project.id) === Number((review as ProjectReview).projectId || 0)
                  );
        }

        let workSmall: WorkSmall | undefined;
        if (
            (reviewsWorks && reviewsWorks.length > 0) ||
            (received && receivedReviewsWorks && receivedReviewsWorks.length > 0)
        ) {
            workSmall = !received
                ? reviewsWorks.find(
                      (work) =>
                          Number(work.id) === Number((review as WorkReview).workId || 0) &&
                          work.workType === (review as WorkReview).workType
                  )
                : receivedReviewsWorks.find(
                      (work) =>
                          Number(work.id) === Number((review as WorkReview).workId || 0) &&
                          work.workType === (review as WorkReview).workType
                  );
        }

        // Construct link
        const identifier = constructIdentifier(review.users || [], review.teams || []);
        const link =
            reviewType === "project_reviews"
                ? `/${identifier}/projects/${projectSmall?.name}/management/project-reviews/${review.id}`
                : "work_reviews"
                ? `/${identifier}/management/work-reviews/${review.id}`
                : undefined;

        return {
            id: review.id,
            itemType: "reviews",
            icon: faEdit,
            title: review.title,
            createdAt: review.createdAt,
            description: review.description,
            users: review.users,
            project: projectSmall,
            work: workSmall,
            link: link,
            public: review.public,
        };
    });
};
