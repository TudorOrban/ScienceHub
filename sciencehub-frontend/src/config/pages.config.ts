export interface PageStructure {
    label: string;
    link: string;
    children?: PageStructure[];
}

/**
 * Object keeping track of ScienceHub's pages.
 */
export const pagesStructure: PageStructure[] = [
    {
        label: "Home",
        link: "/",
    },
    {
        label: "Workspace",
        link: "/workspace",
        children: [
            {
                label: "Research",
                link: "/workspace/research",
                children: [
                    {
                        label: "Projects",
                        link: "/workspace/research/projects",
                    },
                    {
                        label: "Works",
                        link: "/workspace/research/works",
                    },
                ],
            },
            {
                label: "Management",
                link: "/workspace/management",
                children: [
                    {
                        label: "Submissions",
                        link: "/workspace/management/submissions",
                    },
                    {
                        label: "Issues",
                        link: "/workspace/management/issues",
                    },
                    {
                        label: "Reviews",
                        link: "/workspace/management/reviews",
                    },
                ],
            },
            {
                label: "Community",
                link: "/workspace/community",
                children: [
                    {
                        label: "Discussions",
                        link: "/workspace/community/discussions",
                    },
                    {
                        label: "Chats",
                        link: "/workspace/community/chats",
                    },
                    {
                        label: "Teams",
                        link: "/workspace/community/teams",
                    },
                ],
            },
            {
                label: "Plans",
                link: "/workspace/plans",
            },
            {
                label: "Settings",
                link: "/workspace/settings",
            },
        ],
    },
    {
        label: "Browse",
        link: "/browse",
        children: [
            {
                label: "Browse Projects",
                link: "/browse/projects",
            },
            {
                label: "Browse Works",
                link: "/browse/works",
            },
            {
                label: "Browse Submissions",
                link: "/browse/submission",
            },
            {
                label: "Browse Issues",
                link: "/browse/issues",
            },
            {
                label: "Browse Reviews",
                link: "/browse/reviews",
            },
            {
                label: "Browse Discussions",
                link: "/browse/discussions",
            },
            {
                label: "Browse People",
                link: "/browse/people",
            },
        ],
    },
    {
        label: "Resources",
        link: "/resources",
        children: [
            {
                label: "Site mission",
                link: "/resources/site-mission",
            },
            {
                label: "Information",
                link: "/resources/information",
                children: [
                    {
                        label: "Research",
                        link: "/resources/information/research",
                    },
                    {
                        label: "Management",
                        link: "/resources/information/management",
                    },
                    {
                        label: "Community",
                        link: "/resources/information/community",
                    },
                    {
                        label: "Tools",
                        link: "/resources/information/tools",
                    },
                    {
                        label: "Metrics",
                        link: "/resources/information/metrics",
                    },
                ],
            },
            {
                label: "Feedback",
                link: "/resources/feedback",
            },
            {
                label: "Donations",
                link: "/resources/donations",
            },
            {
                label: "Help & Support",
                link: "/resources/help-support",
            },
        ],
    },
];
