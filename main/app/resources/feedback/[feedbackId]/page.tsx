import React from "react";
import FeedbackCard from "@/components/cards/resources/FeedbackCard";
import { Feedback, FeedbackResponse } from "@/types/resourcesTypes";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import supabase from "@/utils/supabase";
import { notFound } from "next/navigation";

export default async function FeedbackPage({
    params: { feedbackId },
}: {
    params: { feedbackId: string };
}) {
    const feedbackData = await fetchGeneralData<Feedback>(supabase, {
        tableName: "feedbacks",
        categories: [],
        options: {
            tableRowsIds: [Number(feedbackId)],
            tableFields: [
                "id",
                "created_at",
                "title",
                "content",
                "tags",
                "public",
                "users(id, username, full_name, avatar_url)",
            ],
            page: 1,
            itemsPerPage: 10,
        },
    });

    const feedbackResponsesData = await fetchGeneralData<FeedbackResponse>(supabase, {
        tableName: "feedback_responses",
        categories: [],
        options: {
            tableFields: [
                "id",
                "created_at",
                "content",
                "feedback_id",
                "users(id, username, full_name, avatar_url)",
            ],
            filters: {
                work_issue_id: Number(feedbackId),
            },
            page: 1,
            itemsPerPage: 10,
        },
    });

    if (!feedbackData.isLoading && feedbackData.data.length === 0) {
        notFound();
    }

    return (
        <FeedbackCard
            feedbackId={Number(feedbackId)}
            initialFeedbackData={feedbackData}
            initialFeedbackResponsesData={feedbackResponsesData}
        />
    );
}
