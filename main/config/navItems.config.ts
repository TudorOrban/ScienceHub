import { Feature } from "@/types/infoTypes";
import {
    faUser,
    faUsers,
    faEdit,
    faFile,
    faPeopleGroup,
    faGlobe,
    faCircleExclamation,
    faDatabase,
    faChartSimple,
    faMicrochip,
    faCalendar,
    faGear,
    faCodeFork,
    faBriefcase,
    faBook,
    faPaste,
    faBoxArchive,
    faClipboardCheck,
    faTableList,
    faBookJournalWhills,
    faBox,
    faUserGroup,
    faEye,
    faInfo,
    faRuler,
    faCommentDots,
    faHandHoldingDollar,
    faQuestion,
    faAtom,
    faMessage,
    faSignsPost,
    faSearch,
    faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { faFlask, faClipboard, faCode } from "@fortawesome/free-solid-svg-icons";

// Sidebar NavItems for main pages
export const homeNavItems = [
    { label: "Home", icon: faGlobe, link: "/" },
    {
        label: "Workspace",
        icon: faBriefcase,
        link: "/workspace",
    },
    {
        label: "Browse",
        icon: faSearch,
        link: "/browse",
    }, 
    {
        label: "Resources",
        icon: faBox,
        link: "/resources",
    },
];

export const workspaceNavItems = [
    { label: "Overview", icon: faGlobe, link: "/workspace" },
    {
        label: "Research",
        icon: faAtom,
        link: "/workspace/research",
        subItems: [
            {
                label: "Projects",
                icon: faBoxArchive,
                link: "/workspace/research/projects",
            },
            { label: "Works", icon: faFile, link: "/workspace/research/works" },
        ],
    },

    {
        label: "Management",
        icon: faCodeFork,
        link: "/workspace/management",
        subItems: [
            {
                label: "Submissions",
                icon: faPaste,
                link: "/workspace/management/submissions",
            },
            {
                label: "Issues",
                icon: faCircleExclamation,
                link: "/workspace/management/issues",
            },
            {
                label: "Reviews",
                icon: faEdit,
                link: "/workspace/management/reviews",
            },
        ],
    },
    {
        label: "Community",
        icon: faPeopleGroup,
        link: "/workspace/community",
        subItems: [
            {
                label: "Discussions",
                icon: faUsers,
                link: "/workspace/community/discussions",
            },
            {
                label: "Chats",
                icon: faMessage,
                link: "/workspace/community/chats",
            },
            {
                label: "Teams",
                icon: faUserGroup,
                link: "/workspace/community/teams",
            },
            // { label: 'Collaborations', icon: faUsers, link: '/workspace/collaborations' },
        ],
    },
    // {
    //     label: "Tools",
    //     icon: faToolbox,
    //     link: "/workspace/tools",
    //     subItems: [
    //         {
    //             label: "Editor",
    //             icon: faFileWord,
    //             link: "/workspace/tools/editor",
    //         },
    //         {
    //             label: "Data management",
    //             icon: faDatabase,
    //             link: "/workspace/tools/data-management",
    //         },
    //         {
    //             label: "AWS Connection",
    //             icon: faCloud,
    //             link: "/workspace/tools/data-analysis",
    //         },
    //         {
    //             label: "AI Models",
    //             icon: faMicrochip,
    //             link: "/workspace/tools/ai-models",
    //         },
    //     ],
    // },
    { label: "Plans", icon: faCalendar, link: "/workspace/plans" },
    { label: "Settings", icon: faGear, link: "/workspace/settings" },
];

export const browseNavItems = [
    { label: "Overview", icon: faGlobe, link: "/browse" },
    {
        label: "Projects",
        icon: faBoxArchive,
        link: "/browse/projects",
    },
    {
        label: "Works",
        icon: faFile,
        link: "/browse/works",
    },
    {
        label: "Submissions",
        icon: faPaste,
        link: "/browse/submissions",
    },
    {
        label: "Issues",
        icon: faCircleExclamation,
        link: "/browse/issues",
    },
    {
        label: "Reviews",
        icon: faEdit,
        link: "/browse/reviews",
    },

    {
        label: "Discussions",
        icon: faPeopleGroup,
        link: "/browse/discussions",
    },
    { label: "People", icon: faUser, link: "/browse/people" },
];

export const resourcesNavItems = [
    { label: "Overview", icon: faGlobe, link: "/resources" },
    { label: "Site mission", icon: faEye, link: "/resources/site-mission" },
    { label: "Site Roadmap", icon: faSignsPost, link: "/resources/site-roadmap" },
    {
        label: "Information",
        icon: faInfo,
        link: "/resources/information",
        subItems: [
            {
                label: "Research",
                icon: faBook,
                link: "/resources/information/research",
            },
            {
                label: "Management",
                icon: faCodeFork,
                link: "/resources/information/management",
            },
            {
                label: "Community",
                icon: faUsers,
                link: "/resources/information/community",
            },
            // {
            //     label: "Tools",
            //     icon: faToolbox,
            //     link: "/resources/information/tools",
            // },
            {
                label: "Metrics",
                icon: faRuler,
                link: "/resources/information/metrics",
            },
        ],
    },
    { label: "Feedback", icon: faCommentDots, link: "/resources/feedback" },
    {
        label: "Donations",
        icon: faHandHoldingDollar,
        link: "/resources/donations",
    },
    {
        label: "Help & Support",
        icon: faQuestion,
        link: "/resources/help-support",
    },
];

export const getProfileNavItems = (username: string, isCurrentUser?: boolean) => {
    const profileNavItems = [
        {
            label: "Overview",
            icon: faGlobe,
            link: `/${username}/profile`,
        },
        {
            label: "Research",
            icon: faBook,
            link: `/${username}/research`,
            subItems: [
                {
                    label: "Projects",
                    icon: faBoxArchive,
                    link: `/${username}/research/projects`,
                },
                {
                    label: "Papers",
                    icon: faClipboard,
                    link: `/${username}/research/papers`,
                },
                {
                    label: "Experiments",
                    icon: faFlask,
                    link: `/${username}/research/experiments`,
                },
                {
                    label: "Datasets",
                    icon: faDatabase,
                    link: `/${username}/research/datasets`,
                },
                {
                    label: "Data Analyses",
                    icon: faChartSimple,
                    link: `/${username}/research/data-analyses`,
                },
                {
                    label: "AI Models",
                    icon: faMicrochip,
                    link: `/${username}/research/ai-models`,
                },
                {
                    label: "Code Blocks",
                    icon: faCode,
                    link: `/${username}/research/code-blocks`,
                },
            ],
        },
        {
            label: "Management",
            icon: faCodeFork,
            link: `/${username}/management`,
            subItems: [
                {
                    label: "Submissions",
                    icon: faPaste,
                    link: `/${username}/management/submissions`,
                },
                {
                    label: "Issues",
                    icon: faCircleExclamation,
                    link: `/${username}/management/issues`,
                },
                {
                    label: "Reviews",
                    icon: faEdit,
                    link: `/${username}/management/reviews`,
                },
            ],
        },
        {
            label: "Community",
            icon: faPeopleGroup,
            link: `/${username}/community`,
            subItems: [
                {
                    label: "Discussions",
                    icon: faUsers,
                    link: `/${username}/community/discussions`,
                },
                {
                    label: "Teams",
                    icon: faUserGroup,
                    link: `/${username}/community/teams`,
                },
            ],
        },
    ];

    if (isCurrentUser) {
        profileNavItems.push({
            label: "Settings",
            icon: faGear,
            link: `/${username}/settings`,
        });
    }

    return profileNavItems;
};

export const getProjectNavItems = (identifier: string, projectName: string) => [
    {
        label: "Project Overview",
        icon: faGlobe,
        link: `/${identifier}/projects/${projectName}`,
    },
    {
        label: "Research",
        icon: faBook,
        link: `/${identifier}/projects/${projectName}/research`,
        subItems: [
            // {
            //     label: "Directory",
            //     icon: faFolder,
            //     link: `/${identifier}/projects/${projectName}/research/directory`,
            // },
            {
                label: "Papers",
                icon: faClipboard,
                link: `/${identifier}/projects/${projectName}/research/papers`,
            },
            {
                label: "Experiments",
                icon: faFlask,
                link: `/${identifier}/projects/${projectName}/research/experiments`,
            },
            {
                label: "Datasets",
                icon: faDatabase,
                link: `/${identifier}/projects/${projectName}/research/datasets`,
            },
            {
                label: "Data Analyses",
                icon: faChartSimple,
                link: `/${identifier}/projects/${projectName}/research/data-analyses`,
            },
            {
                label: "AI Models",
                icon: faMicrochip,
                link: `/${identifier}/projects/${projectName}/research/ai-models`,
            },
            {
                label: "Code Blocks",
                icon: faCode,
                link: `/${identifier}/projects/${projectName}/research/code-blocks`,
            },
        ],
    },

    {
        label: "Management",
        icon: faCodeFork,
        link: `/${identifier}/projects/${projectName}/management`,
        subItems: [
            {
                label: "Submissions",
                icon: faCodeFork,
                link: `/${identifier}/projects/${projectName}/management/submissions`,
            },
            {
                label: "Issues",
                icon: faCircleExclamation,
                link: `/${identifier}/projects/${projectName}/management/issues`,
            },
            {
                label: "Reviews",
                icon: faEdit,
                link: `/${identifier}/projects/${projectName}/management/reviews`,
            },
        ],
    },
    // {
    //     label: "Tools",
    //     icon: faToolbox,
    //     link: `/${identifier}/projects/${projectName}/tools`,
    //     subItems: [
    //         {
    //             label: "Editor",
    //             icon: faFileWord,
    //             link: `/${identifier}/projects/${projectName}/tools/editor`,
    //         },
    //         {
    //             label: "AWS connection",
    //             icon: faCloud,
    //             link: `/${identifier}/${projectName}/tools/aws-connection`,
    //         },
    //         {
    //             label: "AI Models",
    //             icon: faMicrochip,
    //             link: `/${identifier}/${projectName}/tools/ai-models`,
    //         },
    //         //     {
    //         //     label: "Lab inventory",
    //         //     icon: faFlask,
    //         //     link: `/${identifier}/${projectId}/tools/lab-inventory`,
    //         // },
    //         //     {
    //         //         label: "Data management",
    //         //         icon: faDatabase,
    //         //         link: `/${identifier}/${projectId}/tools/data-management`,
    //         //     },
    //     ],
    // },
    {
        label: "Plans",
        icon: faCalendar,
        link: `/${identifier}/projects/${projectName}/plans`,
    },
    {
        label: "Settings",
        icon: faGear,
        link: `/${identifier}/projects/${projectName}/settings`,
    },
];

// Features

export const getProjectCardWorksFeatures = (
    experimentsCount: number,
    datasetsCount: number,
    dataAnalysesCount: number,
    aiModelsCount: number,
    codeBlocksCount: number,
    papersCount: number,
    identifier: string,
    projectName: string
): Feature[] => {
    const features: Feature[] = [
        {
            label: "Papers",
            icon: faClipboard,
            iconColor: "#4A4A4A",
            value: papersCount.toString(),
            link: `/${identifier}/projects/${projectName}/papers`,
        },
        {
            label: "Experiments",
            icon: faFlask,
            iconColor: "#2E3A87",
            value: experimentsCount.toString(),
            link: `/${identifier}/projects/${projectName}/experiments`,
        },
        {
            label: "Datasets",
            icon: faDatabase,
            iconColor: "#1A8E34",
            value: datasetsCount.toString(),
            link: `/${identifier}/projects/${projectName}/datasets`,
        },
        {
            label: "Data Analyses",
            icon: faChartSimple,
            iconColor: "#8B2DAE",
            value: dataAnalysesCount.toString(),
            link: `/${identifier}/projects/${projectName}/data-analyses`,
        },
        {
            label: "AI Models",
            icon: faMicrochip,
            iconColor: "#DAA520",
            value: aiModelsCount.toString(),
            link: `/${identifier}/projects/${projectName}/experiments`,
        },
        {
            label: "Code Blocks",
            icon: faCode,
            iconColor: "#C82333",
            value: codeBlocksCount.toString(),
            link: `/${identifier}/projects/${projectName}/code-blocks`,
        },
    ];
    return features;
};

export const getProjectCardManageFeatures = (
    projectSubmissionsCount: number,
    projectIssuesCount: number,
    projectReviewsCount: number,
    identifier: string,
    projectName: string
): Feature[] => {
    const features: Feature[] = [
        {
            label: "Submissions",
            icon: faCodeFork,
            iconColor: "#4A4A4A",
            value: projectSubmissionsCount.toString(),
            link: `/${identifier}/projects/${projectName}/submissions`,
        },
        {
            label: "Issues",
            icon: faCircleExclamation,
            iconColor: "#4A4A4A",
            value: projectIssuesCount.toString(),
            link: `/${identifier}/projects/${projectName}/issues`,
        },
        {
            label: "Reviews",
            icon: faEdit,
            iconColor: "#4A4A4A",
            value: projectReviewsCount.toString(),
            link: `/${identifier}/projects/${projectName}/reviews`,
        },
    ];
    return features;
};

export const getMetricsFeatures = (
    researchScore: number,
    hIndex: number,
    citations: number
): Feature[] => {
    const features: Feature[] = [
        {
            label: "Research Score",
            icon: faBookJournalWhills,
            iconColor: "#2D2D2D",
            value: researchScore.toString(),
            link: "/resources/information/research-score",
        },
        {
            label: "h-Index",
            icon: faTableList,
            iconColor: "#2D2D2D",
            value: hIndex.toString(),
            link: "/resources/information/h-index",
        },
        {
            label: "Citations",
            icon: faClipboardCheck,
            iconColor: "#2D2D2D",
            value: citations.toString(),
            link: "/resources/information/citations",
        },
    ];
    return features;
};

// Navigation Menu items
export const workspacePageNavigationMenuItems = [
    { label: "Overview", link: "/workspace" },
    { label: "Research", link: "/workspace/research" },
    { label: "Management", link: "/workspace/management" },
    { label: "Community", link: "/workspace/community" },
    // { label: "Tools", link: "/workspace/tools" },
    { label: "Plans", link: "/workspace/plans" },
    { label: "Settings", link: "/workspace/settings" },
];

export const getProjectPageNavigationMenuItems = (identifier: string, projectName: string) => {
    const projectItems = [
        { label: "Overview", link: `/${identifier}/projects/${projectName}` },
        {
            label: "Research",
            link: `/${identifier}/projects/${projectName}/research`,
        },
        {
            label: "Management",
            link: `/${identifier}/projects/${projectName}/management`,
        },
        // {
        //     label: "Tools",
        //     link: `/${identifier}/projects/${projectName}/tools`,
        // },
        {
            label: "Plans",
            link: `/${identifier}/projects/${projectName}/plans`,
        },
        {
            label: "Settings",
            link: `/${identifier}/projects/${projectName}/settings`,
        },
    ];
    return projectItems;
};

export const worksPageNavigationMenuItems = [
    { label: "Papers", icon: faClipboard },
    { label: "Experiments", icon: faFlask },
    { label: "Datasets", icon: faDatabase },
    { label: "Data Analyses", icon: faChartSimple },
    { label: "AI Models", icon: faMicrochip },
    { label: "Code Blocks", icon: faCode },
];

export const submissionsPageNavigationMenuItems = [
    { label: "Project Submissions", icon: faEdit },
    { label: "Work Submissions", icon: faEdit },
];

export const issuesPageNavigationMenuItems = [
    { label: "Project Issues" },
    { label: "Work Issues" },
    { label: "Submission Issues" },
];

export const reviewsPageNavigationMenuItems = [
    { label: "Project Reviews" },
    { label: "Work Reviews" },
];

export const managementFilterNavigationMenuItems = [{ label: "Yours" }, { label: "Received" }];

export const discussionsPageNavigationMenuItems = [
    { label: "Discussions", icon: faUsers },
    { label: "Other", icon: faEdit },
];

export const chatsPageNavigationMenuItems = [
    { label: "Chats", icon: faUsers },
    { label: "Other", icon: faEdit },
];

export const teamsPageNavigationMenuItems = [
    { label: "Teams", icon: faUserGroup },
    { label: "Other", icon: faEdit },
];

export const bookmarksPageNavigationMenuItems = [
    { label: "Projects" },
    { label: "Works" },
    { label: "Management" },
    { label: "Discussions" },
];

export const getUserProfileNavigationMenuItems = (username: string, isCurrentProfile: boolean) => {
    const navItems = [
        { label: "Overview", link: `/${username}/profile` },
        { label: "Research", link: `/${username}/research` },
        { label: "Management", link: `/${username}/management` },
        { label: "Community", link: `/${username}/community` },
    ];

    if (isCurrentProfile) {
        navItems.push({ label: "Settings", link: `/${username}/settings` });
    }

    return navItems;
};
export const userSettingsNavigationMenuItems = [
    { label: "Global Settings", icon: faGlobe },
    { label: "Workspace Settings", icon: faBriefcase },
    { label: "Project Settings", icon: faBox },
    { label: "Profile Settings", icon: faUser },
];

export const workTypes = [
    "Experiment",
    "Dataset",
    "Data Analysis",
    "AI Model",
    "Code Block",
    "Paper",
];

export const databaseWorkTypes = [
    "experiments",
    "datasets",
    "data_analyses",
    "ai_models",
    "code_blocks",
    "papers",
];

export const managementTypes = ["Submission", "Issue", "Review"];
