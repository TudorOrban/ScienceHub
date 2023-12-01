import { GeneralInfo } from "@/types/infoTypes";
import { Review } from "@/types/managementTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { WorkSmall } from "@/types/workTypes";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export const transformToReviewsInfo = (
    reviewsData: Review[],
    reviewsProjects: ProjectSmall[],
    receivedReviewsProjects: ProjectSmall[],
    reviewsWorks: WorkSmall[],
    receivedReviewsWorks: WorkSmall[],
    received?: boolean
): GeneralInfo[] => {
    
    return reviewsData.map((review: Review) => {
        let projectSmall: ProjectSmall | undefined;
        if (
            (reviewsProjects && reviewsProjects.length > 0) ||
            (received &&
                receivedReviewsProjects &&
                receivedReviewsProjects.length > 0)
        ) {
            projectSmall = !received
                ? reviewsProjects.find(
                      (project) =>
                          Number(project.id) ===
                          Number(review.objectId || 0)
                  )
                : receivedReviewsProjects.find(
                      (project) =>
                          Number(project.id) ===
                          Number(review.objectId || 0)
                  );
        }

        let workSmall: WorkSmall | undefined;
        if (
            (reviewsWorks && reviewsWorks.length > 0) ||
            (received &&
                receivedReviewsWorks &&
                receivedReviewsWorks.length > 0)
        ) {
            workSmall = !received
                ? reviewsWorks.find(
                      (work) =>
                          Number(work.id) === Number(review.objectId || 0)
                  )
                : receivedReviewsWorks.find(
                      (work) =>
                          Number(work.id) === Number(review.objectId || 0)
                  );
        }

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
            link: `/workspace/reviews/${review.id}`,
            public: review.public,
        };
    });
};