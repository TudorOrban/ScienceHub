import { Feature } from "@/types/infoTypes";
import { AvailableSearchOptionsAdvanced } from "@/types/searchTypes";
import {
    faBoxArchive,
    faCircleInfo,
    faEdit,
    faFile,
    faPaste,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Configuration of search options for Browse pages
 */

// Browse pages
export const browsePages: Feature[] = [
    { label: "Projects", icon: faBoxArchive, link: "/browse/projects" },
    { label: "Works", icon: faFile, link: "/browse/works" },
    { label: "Submissions", icon: faPaste, link: "/browse/submissions" },
    { label: "Issues", icon: faCircleInfo, link: "/browse/issues" },
    { label: "Reviews", icon: faEdit, link: "/browse/reviews" },
];

// Projects
export const projectsAvailableSearchOptions: AvailableSearchOptionsAdvanced = {
    availableSearchByFieldOptions: [
        { label: "Title", value: "title" },
        { label: "Name", value: "title" },
        { label: "Description", value: "description" },
    ],
    availableSortOptions: [
        { label: "By Updated at Date", value: "updated_at" },
        { label: "By Created at Date", value: "created_at" },
        { label: "By Work Title", value: "title" },
        { label: "By Research Score", value: "research_score" },
        { label: "By h-Index", value: "h_index" },
        { label: "By Citations", value: "citations" },
        { label: "By Upvotes", value: "upvotes" },
        { label: "By Shares", value: "shares" },
        { label: "By Views", value: "views" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Peer-reviewed", value: "peer_reviewed" },
        { label: "Completed", value: "completed" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Updated at", value: "updated_at" },
    ],
    availableMetricOptions: [
        { label: "By Research Score", value: "research_score" },
        { label: "By h-Index", value: "h_index" },
        { label: "By Citations", value: "citations" },
        { label: "By Upvotes", value: "upvotes" },
        { label: "By Shares", value: "shares" },
        { label: "By Views", value: "views" },
    ],
    availableFieldsOfResearch: [
        {
            label: "Mathematics",
            value: "mathematics",
        },
        {
            label: "Physics",
            value: "physics",
        },
        {
            label: "Chemistry",
            value: "chemistry",
        },
        {
            label: "Biology",
            value: "biology",
        },
        {
            label: "Computer Science",
            value: "computer_science",
        },
    ],
};

// Works
export const worksAvailableSearchOptions: AvailableSearchOptionsAdvanced = {
    availableSearchByFieldOptions: [
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
    ],
    availableSortOptions: [
        { label: "By Updated at Date", value: "updated_at" },
        { label: "By Created at Date", value: "created_at" },
        { label: "By Work Title", value: "title" },
        { label: "By Research Score", value: "research_score" },
        { label: "By h-Index", value: "h_index" },
        { label: "By Citations", value: "citations" },
        { label: "By Upvotes", value: "upvotes" },
        { label: "By Shares", value: "shares" },
        { label: "By Views", value: "views" },
    ],
    availableStatusOptions: [
        { label: "Ongoing", value: "ongoing" },
        { label: "Peer-reviewed", value: "peer_reviewed" },
        { label: "Completed", value: "completed" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Updated at", value: "updated_at" },
    ],
    availableMetricOptions: [
        { label: "By Research Score", value: "research_score" },
        { label: "By h-Index", value: "h_index" },
        { label: "By Citations", value: "citations" },
        { label: "By Upvotes", value: "upvotes" },
        { label: "By Shares", value: "shares" },
        { label: "By Views", value: "views" },
    ],
    availableFieldsOfResearch: [
        {
            label: "Mathematics",
            value: "mathematics",
        },
        {
            label: "Physics",
            value: "physics",
        },
        {
            label: "Chemistry",
            value: "chemistry",
        },
        {
            label: "Biology",
            value: "biology",
        },
        {
            label: "Computer Science",
            value: "computer_science",
        },
    ],
};

// Submissions
export const submissionsAvailableSearchOptions: AvailableSearchOptionsAdvanced = {
    availableSearchByFieldOptions: [
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
    ],
    availableSortOptions: [
        { label: "By Updated at Date", value: "updated_at" },
        { label: "By Created at Date", value: "created_at" },
        { label: "By Submission Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "In progress", value: "In progress" },
        { label: "Submitted", value: "Submitted" },
        { label: "Accepted", value: "Accepted" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Updated at", value: "updated_at" },
    ],
    // availableMetricOptions: [
    //     { label: "By Research Score", value: "research_score" },
    //     { label: "By h-Index", value: "h_index" },
    //     { label: "By Citations", value: "citations" },
    //     { label: "By Upvotes", value: "upvotes" },
    //     { label: "By Shares", value: "shares" },
    //     { label: "By Views", value: "views" },
    // ],
};

// Issues
export const issuesAvailableSearchOptions: AvailableSearchOptionsAdvanced = {
    availableSearchByFieldOptions: [
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
    ],
    availableSortOptions: [
        { label: "By Updated at Date", value: "updated_at" },
        { label: "By Created at Date", value: "created_at" },
        { label: "By Issue Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "Open", value: "Opened" },
        { label: "Closed", value: "Closed" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Updated at", value: "updated_at" },
    ],
};

// Reviews
export const reviewsAvailableSearchOptions: AvailableSearchOptionsAdvanced = {
    availableSearchByFieldOptions: [
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
    ],
    availableSortOptions: [
        { label: "By Updated at Date", value: "updated_at" },
        { label: "By Created at Date", value: "created_at" },
        { label: "By Review Title", value: "title" },
    ],
    availableStatusOptions: [
        { label: "In progress", value: "In progress" },
        { label: "Submitted", value: "Submitted" },
    ],
    availableDateOptions: [
        { label: "Created at", value: "created_at" },
        { label: "Updated at", value: "updated_at" },
    ],
};
