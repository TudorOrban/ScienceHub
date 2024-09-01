import { AvailableSearchOptions } from "@/src/types/searchTypes";

/**
 * Configuration of search options for Workspace pages
 */
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
    availableFilterOptions: [{ label: "Recently Modified", value: { updated_at: "" } }],
};

// Projects
export const projectsAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "createdAt" },
        { label: "Project Title", value: "Title" },
        { label: "Research Score", value: "research_score" },
        { label: "h-Index", value: "h_index" },
        { label: "Total Citations", value: "total_citations_count" },
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
};

// Submissions
export const submissionsAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Last Modified", value: "updated_at" },
        { label: "Created at", value: "created_at" },
        { label: "Submission Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "In progress", value: "In progress" },
        { label: "Submitted", value: "Submitted" },
        { label: "Accepted", value: "Accepted" },
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
        { label: "Opened", value: "Opened" },
        { label: "Closed", value: "Closed" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Last Modified", value: "updated_at" },
    ],
};

// Reviews
export const reviewsAvailableSearchOptions: AvailableSearchOptions = {
    availableSortOptions: [
        { label: "Created at", value: "createdAt" },
        { label: "Review Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "In progress", value: "In progress" },
        { label: "Submitted", value: "Submitted" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Last Modified", value: "updated_at" },
    ],
};
