import { Team } from "@/types/communityTypes";
import { User } from "@/types/userTypes";
import { constructIdentifier } from "./constructIdentifier";
import { getObjectNames } from "@/config/getObjectNames";

/**
 * Utils for constructing object urls
 */
// TODO: Move all to backend
export const constructProjectUrl = (projectName: string, users: User[], teams: Team[]) => {
    const identifier = constructIdentifier(users, teams);
    return `/${identifier}/research/projects/${projectName}`;
};

export const constructWorkUrl = (
    workId: number,
    workType: string,
    users: User[],
    teams: Team[],
    projectLink?: string
) => {
    const identifier = constructIdentifier(users, teams);
    const linkName = getObjectNames({ label: workType })?.linkName;
    // Return based on whether work belongs to a project
    return projectLink
        ? `${projectLink}/research/${linkName}/${workId}`
        : `/${identifier}/research/${linkName}/${workId}`;
};

export const constructSubmissionUrl = (
    submissionId: number,
    users: User[],
    teams: Team[],
    submissionType: "Project" | "Work",
    projectLink?: string
) => {
    const identifier = constructIdentifier(users, teams);
    switch (submissionType) {
        // If project submission, route to project pages or undefined if projectLink not available
        case "Project":
            if (projectLink) {
                return `${projectLink}/management/project-submissions/${submissionId}`;
            } else {
                return undefined;
            }
        // If work submission, route to work pages if projectLink not available or to user pages otherwise
        case "Work":
            if (projectLink) {
                return `${projectLink}/management/work-submissions/${submissionId}`;
            } else {
                return `/${identifier}/management/work-submissions/${submissionId}`;
            }
        default:
            return undefined;
    }
};

export const constructIssueUrl = (
    issueId: number,
    users: User[],
    teams: Team[],
    issueType: "Project" | "Work",
    projectLink?: string
) => {
    const identifier = constructIdentifier(users, teams);
    switch (issueType) {
        // If project issue, route to project pages or undefined if projectLink not available
        case "Project":
            if (projectLink) {
                return `${projectLink}/management/project-issues/${issueId}`;
            } else {
                return undefined;
            }
        // If work issue, route to work pages if projectLink not available or to user pages otherwise
        case "Work":
            if (projectLink) {
                return `${projectLink}/management/work-issues/${issueId}`;
            } else {
                return `/${identifier}/management/work-issues/${issueId}`;
            }
        default:
            return undefined;
    }
};

export const constructReviewUrl = (
    reviewId: number,
    users: User[],
    teams: Team[],
    reviewType: "Project" | "Work",
    projectLink?: string
) => {
    const identifier = constructIdentifier(users, teams);
    switch (reviewType) {
        // If project review, route to project pages or undefined if projectLink not available
        case "Project":
            if (projectLink) {
                return `${projectLink}/management/project-reviews/${reviewId}`;
            } else {
                return undefined;
            }
        // If work review, route to work pages if projectLink not available or to user pages otherwise
        case "Work":
            if (projectLink) {
                return `${projectLink}/management/work-reviews/${reviewId}`;
            } else {
                return `/${identifier}/management/work-reviews/${reviewId}`;
            }
        default:
            return undefined;
    }
};
