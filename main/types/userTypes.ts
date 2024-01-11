import { PinnedPage } from "@/contexts/sidebar-contexts/SidebarContext";
import { Chat, Discussion, Team } from "./communityTypes";
import { ProjectDelta, ProjectSubmission, ProjectSubmissionSmall, WorkSubmission } from "./versionControlTypes";
import { AIModel, AIModelSmall, Citation, CodeBlock, CodeBlockSmall, DataAnalysis, DataAnalysisSmall, Dataset, DatasetSmall, Experiment, ExperimentSmall, Paper, PaperSmall, WorkIdentifier, WorkSmall } from "./workTypes";
import Stripe from "stripe";
import { ProjectSmall } from "./projectTypes";
import { ProjectIssue, ProjectReview } from "./managementTypes";


// Mai user types

export interface User {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
}

export interface UserFullDetails {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    status?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    lastLogin?: Date | null;
    createdAt?: string;
    updatedAt?: string;
    teamIds?: string[];
    numberOfProjects?: number;
    numberOfWorks?: number;
    numberOfSubmissions?: number;
    researchScore?: number;
    hIndex?: number;
    totalCitationsCount?: number;
    totalCitations?: Citation[];
    totalUpvotes?: Citation[];
    reviewsCount?: number;
    isVerified?: boolean;
    qualifications?: string;
    fieldsOfResearch?: string;
    occupations?: string;
    location?: string;
    positions?: string[];
    externalAccounts?: { link: string; site: string; }[];
    affiliations?: string;
    researchInterests?: string;
    roles?: string;
    education?: string;
    contactInformation?: string;
    followers?: User[];
    following?: User[];
}

export interface UserData {
    id: string;
    username: string;
    fullName: string;
    experiments: ExperimentSmall[];
    datasets: DatasetSmall[];
    dataAnalyses: DataAnalysisSmall[];
    aiModels: AIModelSmall[];
    codeBlocks: CodeBlockSmall[];
    papers: PaperSmall[];
    projectSubmissions: ProjectSubmissionSmall[];
    projectIssues: ProjectIssue[];
    projectReviews: ProjectReview[];
}

export type UserFullDetailsKey = keyof UserFullDetails;

// User Settings
export type UserSettings = {
    userId?: number;
    researchHighlights?: ResearchHighlight[];
    pinnedPages?: PinnedPage[];
    headerOff?: boolean;
    theme?: "light" | "dark";
    notificationsOn?: boolean;
    editorSettings?: EditorSettings;
};

export type EditorSettings = {
    openedProject?: ProjectSmall;
    openedWorkIdentifiers?: Record<number, Record<number, WorkIdentifier>>;
    openedProjectSubmission?: ProjectSubmission;
};

export interface ResearchHighlight {
    id: string;
    itemType: string;
    title?: string;
    projectName?: string;
    link?: string;
    createdAt?: string;
}



// Subscriptions
export interface UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    avatar_url?: string;
    billing_address?: Stripe.Address;
    payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Product {
    id: string;
    active?: boolean;
    name?: string;
    description?: string;
    image?: string;
    metadata?: Stripe.Metadata;
}

export interface Price {
    id: string;
    product_id?: string;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type?: Stripe.Price.Type;
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number | null;
    metadata?: Stripe.Metadata;
    products?: Product;
}

export interface Subscription {
    id: string;
    user_id: string;
    status?: Stripe.Subscription.Status;
    metadata?: Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    ended_at?: string;
    cancel_at?: string;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    prices?: Price;
}
