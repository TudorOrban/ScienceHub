import supabase from "@/utils/supabase";
import { snakeCaseToCamelCase } from "../fetchGeneralData";
import { FeedbackResponse } from "@/types/resourcesTypes";
import { SnakeCaseObject } from "../fetchGeneralDataAdvanced";

export const fetchFeedbackResponses = async (feedbackId: number, page: number, itemsPerPage: number) => {
    const { data, error } = await supabase
        .from("feedback_responses")
        .select("*")
        .eq("feedback_id", feedbackId)
        .order("created_at", { ascending: false })
        .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

    if (error || !data) {
        console.log("Error fetching chat messages: ", error);
        return;
    }

    return snakeCaseToCamelCase<FeedbackResponse[]>(data as SnakeCaseObject<FeedbackResponse[]>);
};
