import { Team } from "./communityTypes";
import { User } from "./userTypes";
import { SubmissionSmall } from "./versionControlTypes";

// - Issues
export interface IssueSmall {
    id: number;
    objectType?: string;
    objectId?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    title?: string;
    users?: User[];
    public?: boolean;
    link?: string;
}

export interface ProjectIssue {
    id: number;
    projectId?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    title?: string;
    description?: string;
    users?: User[];
    teams?: Team[];
    public?: boolean;
    link?: string;
}


export interface WorkIssue {
    id: number;
    workId?: number;
    workType?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    title?: string;
    description?: string;
    users?: User[];
    teams?: Team[];
    public?: boolean;
    link?: string;
}

export type Issue = ProjectIssue | WorkIssue;
export interface ProjectIssueResponse {
    id: number;
    userId?: string;
    users: User;
    projectIssueId?: number;
    createdAt?: string;
    content?: string;
}

export interface WorkIssueResponse {
    id: number;
    userId?: string;
    users: User;
    workIssueId?: number;
    createdAt?: string;
    content?: string;
}
export type IssueResponse = ProjectIssueResponse | WorkIssueResponse;

// - Reviews
export interface ReviewSmall {
    id: number;
    reviewType?: string;
    objectType?: string;
    objectId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    users?: User[];
    public?: boolean;
}

export type ReviewType = "Community Review" | "Blind Review";
export type ReviewStatus = "In progress" | "Submitted";

export interface ProjectReview {
    id: number;
    reviewType?: string;
    projectId?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: ReviewStatus;
    title?: string;
    description?: string;
    content?: string;
    users?: User[];
    teams?: Team[];
    public?: boolean;
    link?: string;
}

export interface ProjectReviewUser {
    userId?: string;
    user?: User;
    projectReviewId?: number;
}

export interface ProjectReviewSearchDTO {
    id: number;
    projectId?: number;
    createdAt?: string;
    title?: string;
    description?: string;
    status?: ReviewStatus;
    projectReviewUsers?: ProjectReviewUser[];
}

export interface WorkReview {
    id: number;
    reviewType?: string;
    workType?: string;
    workId?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: ReviewStatus;
    title?: string;
    description?: string;
    content?: string;
    users?: User[];
    teams?: Team[];
    public?: boolean;
    link?: string;
}

export type Review = ProjectReview | WorkReview;

export type ManagementSmall = SubmissionSmall | IssueSmall | ReviewSmall;