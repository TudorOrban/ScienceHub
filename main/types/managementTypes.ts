import { User } from "./userTypes";
import { SubmissionSmall } from "./versionControlTypes";

export interface IssueSmall {
    id: number;
    objectType?: string;
    objectId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    users?: User[];
    public?: boolean;
}

export interface Issue {
    id: number;
    objectType?: string;
    objectId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    description?: string;
    users?: User[];
    public?: boolean;
}

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

export type ManagementSmall = SubmissionSmall | IssueSmall | ReviewSmall;