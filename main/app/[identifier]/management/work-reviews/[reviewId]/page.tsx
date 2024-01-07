import React from "react";
import WorkReviewCard from "@/components/cards/management/WorkReviewCard";
import { WorkReview } from "@/types/managementTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function WorkReviewPage({
    params: { reviewId },
}: {
    params: { reviewId: string };
}) {
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

    // const isAuthorized = datasetData.data[0].public || ()

    if (!workReviewData.isLoading && workReviewData.data.length === 0) {
        notFound();
    }

    return <WorkReviewCard reviewId={Number(reviewId)} initialReviewData={workReviewData} />;
}
