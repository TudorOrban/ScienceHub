import React from "react";
import ProjectReviewCard from "@/components/cards/management/ProjectReviewCard";
import { ProjectReview } from "@/types/managementTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function ProjectReviewPage({
    params: { reviewId },
}: {
    params: { reviewId: string };
}) {
    const projectReviewData = await fetchGeneralData<ProjectReview>(supabase, {
        tableName: "project_reviews",
        categories: ["users"],
        options: {
            tableRowsIds: [Number(reviewId)],
            page: 1,
            itemsPerPage: 10,
            categoriesFetchMode: {
                users: "fields",
            },
            categoriesFields: {
                users: ["id", "username", "full_name"],
            },
        },
    });

    // const isAuthorized = datasetData.data[0].public || ()

    if (!projectReviewData.isLoading && projectReviewData.data.length === 0) {
        notFound();
    }

    return <ProjectReviewCard reviewId={Number(reviewId)} initialReviewData={projectReviewData} />;
}
