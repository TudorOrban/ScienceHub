import { objectUtil } from "zod";
import { IssueSmall, ManagementSmall, ReviewSmall } from "./managementTypes";
import { MediumProjectCard } from "./projectTypes";
import { User } from "./userTypes";
import { Submission } from "./versionControlTypes";
import { WorkSmall } from "./workTypes";
import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";

// Community
export interface DiscussionSmall {
    id: number;
    userId: number;
    user?: User;
    createdAt?: string;
    title?: string;
    content?: string;
}

export interface Discussion {
    id: number;
    userId: number;
    users?: User;
    createdAt?: string;
    title?: string;
    content?: string;
    discussionComments?: Comment[];
}

export interface Comment {
    id: number;
    userId: number;
    discussionId?: number;
    user?: User;
    createdAt?: string;
    parentCommentId?: string;
    content: string;
}

export interface Chat {
    id: number;
    users: User[];
    chatMessages?: ChatMessage[];
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    content?: string;
}

export interface ChatMessage {
    id: number;
    chatId: number;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    content?: string;
}
export type SnakeCaseChatMessage = SnakeCaseObject<ChatMessage>;

export interface Team {
    id: string;
    teamUsername?: string;
    teamName?: string;
    avatarUrl?: string;
    users?: User[];
    createdAt?: string;
    updatedAt?: string;
}

export type BookmarkType = MediumProjectCard | WorkSmall | ManagementSmall | Discussion;

export interface Bookmark {
    id: string;
    users: User[];
    objectType: string;
    objectId: number;
    bookmarkData: BookmarkType;
}

// Community actions types
export interface UserCommunityActionsSmall {
    id: string;
    projectUpvotes?: ProjectUpvote[];
    bookmarks?: BookmarkSmall[];
}

export interface BookmarkSmall {
    id: string;
    userId: string;
    objectType: string;
    objectId: number;
}


export interface ProjectUpvote {
    projectId: number;
    upvotingUserId: string;
    createdAt?: string;
}