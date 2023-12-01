import { IssueSmall, ManagementSmall, ReviewSmall } from "./managementTypes";
import { MediumProjectCard } from "./projectTypes";
import { User } from "./userTypes";
import { Submission } from "./versionControlTypes";
import { WorkSmall } from "./workTypes";

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
    chatMessages: ChatMessage[];
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    content?: string;
}

export interface ChatMessage {
    id: number;
    chatId: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    content?: string;
}

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
// Arrays

// export interface Discussions {
//     discussions: Discussion[];
//     extraInfo?: string;
// }

// export interface Chats {
//     chats: Chat[];
//     extraInfo?: string;
// }

// export interface Teams {
//     teams: Team[];
//     extraInfo?: string;
// }