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
}

export interface ProjectIssue {
    id: number;
    projectId?: number;
    createdAt?: string;
    status?: string;
    title?: string;
    description?: string;
    users?: User[];
    public?: boolean;
}


export interface WorkIssue {
    id: number;
    workId?: number;
    workType?: string;
    createdAt?: string;
    status?: string;
    title?: string;
    description?: string;
    users?: User[];
    public?: boolean;
}

export interface Issue {
    id: number;
    objectType?: string;
    objectId?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    title?: string;
    description?: string;
    users?: User[];
    public?: boolean;
}

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

export interface Review {
    id: number;
    reviewType?: string;
    objectType?: string;
    objectId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    description?: string;
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
    status?: ReviewStatus;
    title?: string;
    description?: string;
    users?: User[];
    public?: boolean;
}

export interface WorkReview {
    id: number;
    reviewType?: string;
    workType?: string;
    workId?: number;
    createdAt?: string;
    status?: ReviewStatus;
    title?: string;
    description?: string;
    content?: string;
    users?: User[];
    public?: boolean;
}

export type ManagementSmall = SubmissionSmall | IssueSmall | ReviewSmall;