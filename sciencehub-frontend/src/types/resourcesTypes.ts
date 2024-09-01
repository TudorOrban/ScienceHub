import { User } from "./userTypes";

export interface Feedback {
    id: number;
    userId: string;
    users?: User;
    createdAt?: string;
    title?: string;
    description?: string;
    content?: string;
    tags?: string[];
    public?: boolean;
}

export interface FeedbackResponse {
    id: number;
    feedbackId: number;
    userId: string;
    users?: User;
    createdAt?: string;
    content?: string;
    public?: boolean;
}