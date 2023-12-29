import supabase from "@/utils/supabase";
import { snakeCaseToCamelCase } from "./fetchGeneralData";
import { ProjectIssue, ProjectIssueResponse } from "@/types/managementTypes";

export const fetchProjectIssueResponses = async (
    issueId: number,
    page: number,
    itemsPerPage: number
) => {
    let query = supabase
        .from("project_issue_responses")
        .select(
            "id, project_issue_id, created_at, content, users!project_issue_responses_user_id_fkey(id, username, full_name, avatar_url)"
        )
        .eq("project_issue_id", issueId)
        .order("created_at", { ascending: false });

    const { data, error } = await query.range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
   

    if (error || !data) {
        console.log("Error fetching project issue responses: ", error);
        return;
    }

    return snakeCaseToCamelCase<ProjectIssueResponse[]>(data);
};
