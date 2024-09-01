import React from "react";
import { Feedback } from "@/src/types/resourcesTypes";
import { fetchGeneralData } from "@/src/services/fetch/fetchGeneralData";
import supabase from "@/src/utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FeedbackHeader from "@/src/components/cards/resources/FeedbackHeader";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export const revalidate = 3600;

export default async function FeedbackPage() {
    const feedbacksData = await fetchGeneralData<Feedback>(supabase, {
        tableName: "feedbacks",
        categories: [],
        options: {
            tableFields: [
                "id",
                "created_at",
                "title",
                "description",
                "users(id, username, full_name, avatar_url)",
            ],
            page: 1,
            itemsPerPage: 10,
        },
    });

    return (
        <div className="p-4 sm:p-12">
            <div className="text-3xl font-semibold mb-2">Feedback</div>
            <span className="text-lg">
                All feedback is most welcome and will be adressed as soon as possible.
            </span>
            <div className="flex items-center my-4">
                <span className="font-semibold text-xl">Public Feedbacks</span>
                <span className="ml-2 text-lg">{`(${feedbacksData.data?.length || 0})`}</span>
                <Link
                    href={"/resources/feedback/add"}
                    className="flex items-center ml-2 text-blue-600 hover:text-blue-700 whitespace-nowrap"
                >
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                    {"Add Feedback"}
                </Link>
            </div>
            
            <ul className="space-y-4">
                {feedbacksData.data?.map((feedback) => (
                    <li key={feedback.id}>
                        <FeedbackHeader feedback={feedback} isLoading={feedbacksData.isLoading} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
