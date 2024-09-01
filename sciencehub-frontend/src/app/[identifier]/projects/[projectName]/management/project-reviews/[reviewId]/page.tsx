import React from "react";
import ProjectReviewCard from "@/src/components/cards/management/ProjectReviewCard";
import { ProjectReview } from "@/src/types/managementTypes";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import supabase from "@/src/utils/supabase";
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

    if (!projectReviewData.isLoading && projectReviewData.data.length === 0) {
        notFound();
    }

    return <ProjectReviewCard reviewId={Number(reviewId)} initialReviewData={projectReviewData} />;
}
