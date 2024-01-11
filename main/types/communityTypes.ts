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
    userId: string;
    users?: User;
    createdAt?: string;
    title?: string;
    content?: string;
}

export interface Discussion {
    id: number;
    userId?: string;
    users?: User;
    createdAt?: string;
    title?: string;
    content?: string;
    discussionComments?: Comment[];
    discussionUpvotes?: { count: number }[];
    discussionRepostsCount?: number;
    discussionBookmarksCount?: number;
}

export interface Comment {
    id: number;
    userId?: string;
    discussionId?: number;
    users?: User | null;
    createdAt?: string;
    parentCommentId?: number | null;
    content?: string;
    comments?: Comment[];
    childrenCommentsCount?: number;
    commentUpvotes?: { count: number }[];
    commentRepostsCount?: number;
    commentBookmarksCount?: number;
}
export type SnakeCaseComment = SnakeCaseObject<Comment>;

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
    discussionUpvotes?: DiscussionUpvote[];
    commentUpvotes?: CommentUpvote[];
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

export interface DiscussionUpvote {
    discussionId: number;
    userId: string;
    createdAt?: string;
}

export interface CommentUpvote {
    commentId: number;
    userId: string;
    createdAt?: string;
}