import React from "react";
import WorkReviewCard from "@/src/components/cards/management/WorkReviewCard";
import { WorkReview } from "@/src/types/managementTypes";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import supabase from "@/src/utils/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function WorkReviewPage({
    params: { reviewId },
}: {
    params: { reviewId: string };
}) {
    // Fetch work review
    const workReviewData = await fetchGeneralData<WorkReview>(supabase, {
        tableName: "work_reviews",
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

    if (!workReviewData.isLoading && workReviewData.data.length === 0) {
        notFound();
    }

    return <WorkReviewCard reviewId={Number(reviewId)} initialReviewData={workReviewData} />;
}
