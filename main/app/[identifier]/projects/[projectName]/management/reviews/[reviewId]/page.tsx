"use client";

import React from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Review } from "@/types/managementTypes";
import ReviewCard from "@/components/cards/management/ReviewCard";
import { useReviewData } from "@/hooks/fetch/data-hooks/management/useReviewData";

export default function ReviewPage({ params }: { params: { reviewId: string } }) {
    const reviewData = useReviewData(params.reviewId, true);
    const emptyReview: Review = { id: 0, title: "" };

    return (
        <div>
            <div className="m-3">
                <Breadcrumb />
            </div>

            <div className="m-6">
                <ReviewCard review={reviewData.data[0] || emptyReview} />
            </div>
        </div>
    );
}
