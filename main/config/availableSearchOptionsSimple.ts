import { AvailableSearchOptions } from "@/types/searchTypes";

export const defaultAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Completed", value: "completed" },
    ],
    availableFilterOptions: [
        { label: "Recently Modified", value: { updated_at: "" } }
    ],
};

// Projects
export const projectsAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Project Title", value: "title" },
        { label: "Research Score", value: "research_score" },
        { label: "h-Index", value: "h_index" },
        { label: "Total Citations", value: "total_citations_count" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Peer-reviewed", value: "peer_reviewed" },
        { label: "Completed", value: "completed" },
    ],
};

// Works
export const worksAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Work Title", value: "title" },
        { label: "Research Score", value: "research_score" },
        { label: "h-Index", value: "h_index" },
        { label: "Citations", value: "citations" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Peer-reviewed", value: "peer_reviewed" },
        { label: "Completed", value: "completed" },
    ],
};

// Submissions
export const submissionsAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Submission Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Submitted", value: "submitted" },
        { label: "Accepted", value: "accepted" },
    ],
};

// Issues
export const issuesAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Issue Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Last Modified", value: "updated_at" },
    ],
};

// Reviews
export const reviewsAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Review Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Completed", value: "completed" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Last Modified", value: "updated_at" },
    ],
};