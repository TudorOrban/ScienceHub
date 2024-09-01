import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { User } from "./userTypes";
import { Team } from "./communityTypes";
import { ProjectSmall } from "./projectTypes";
import { WorkSmall } from "./workTypes";

export type WorkInfo = {
    id?: number | string;
    workType?: string;
    icon?: IconDefinition;
    iconColor?: string;
    title?: string;
    createdAt?: string;
    status?: string;
    description?: string;
    users?: User[];
    teams?: Team[];
    link?: string;
    public?: boolean;
};

export type GeneralInfo = {
    id?: number | string;
    itemType?: string;
    icon?: IconDefinition;
    iconColor?: string;
    title?: string;
    createdAt?: string;
    status?: string;
    description?: string;
    public?: boolean;
    users?: User[];
    teams?: Team[];
    project?: ProjectSmall;
    work?: WorkSmall;
    content?: string;
    link?: string;
    context?: string;
};

export type ChatInfo = {
    id?: number | string;
    chatId?: string;
    title?: string;
    createdAt?: string;
    status?: string;
    description?: string;
    lastMessage?: string;
    isLastMessageOwn?: boolean;
    otherUserAvatarUrl?: string;
    lastMessageDaysAgo?: string;
    public?: boolean;
    users?: User[];
    context?: string;
};

export type DiscussionInfo = {
    id?: number | string;
    discussionId?: number;
    title?: string;
    createdAt?: string;
    status?: string;
    content?: string;
    daysAgo?: string;
    discussionComments?: CommentInfo[];
    upvotesCount?: number;
    repostsCount?: number;
    bookmarksCount?: number;
    public?: boolean;
    user: User;
};

export type CommentInfo = {
    id?: number | string;
    parentCommentId?: string;
    discussionId?: string;
    title?: string;
    createdAt?: string;
    status?: string;
    content?: string;
    daysAgo?: string;
    discussionComments?: CommentInfo[];
    upvotesCount?: number;
    repostsCount?: number;
    bookmarksCount?: number;
    public?: boolean;
    user: User;
};

// Other info types

export type NavItem = {
    label: string;
    icon?: IconDefinition;
    subItems?: NavItem[];
    link?: string;
};

export type Feature = {
    label: string;
    icon?: IconDefinition;
    iconColor?: string;
    value?: string;
    link?: string;
};