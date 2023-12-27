
export type ObjectNames = {
    label?: string;
    plural?: string;
    tableName?: string;
    tableNameForIntermediate?: string;
    camelCase?: string;
    linkName?: string;
};

export const objectNames: Record<string, ObjectNames> = {
    "Project": {
        label: "Project",
        plural: "Projects",
        tableName: "projects",
        tableNameForIntermediate: "project",
        camelCase: "projects",
        linkName: "projects",
    },
    // Works
    "Experiment": {
        label: "Experiment",
        plural: "Experiments",
        tableName: "experiments",
        tableNameForIntermediate: "experiment",
        camelCase: "experiments",
        linkName: "experiments",
    },
    "Dataset": {
        label: "Dataset",
        plural: "Datasets",
        tableName: "datasets",
        tableNameForIntermediate: "dataset",
        camelCase: "datasets",
        linkName: "datasets",
    },
    "Data Analysis": {
        label: "Data Analysis",
        plural: "Data Analyses",
        tableName: "data_analyses",
        tableNameForIntermediate: "data_analysis",
        camelCase: "dataAnalyses",
        linkName: "data-analyses",
    },
    "AI Model": {
        label: "AI Model",
        plural: "AI Models",
        tableName: "ai_models",
        tableNameForIntermediate: "ai_model",
        camelCase: "aiModels",
        linkName: "ai-models",
    },
    "Code Block": {
        label: "Code Block",
        plural: "Code Blocks",
        tableName: "code_blocks",
        tableNameForIntermediate: "code_block",
        camelCase: "codeBlocks",
        linkName: "code-blocks",
    },
    "Paper": {
        label: "Paper",
        plural: "Papers",
        tableName: "papers",
        tableNameForIntermediate: "paper",
        camelCase: "papers",
        linkName: "papers",
    },
    "Folder": {
        label: "Folder",
        plural: "Folders",
        tableName: "folders",
        tableNameForIntermediate: "folders",
        camelCase: "folders",
        linkName: "directory",
    },
    "File": {
        label: "File",
        plural: "Files",
        tableName: "files",
        tableNameForIntermediate: "file",
        camelCase: "files",
        linkName: "files",
    },
    "Project Submission": {
        label: "Project Submission",
        plural: "Project Submissions",
        tableName: "project_submissions",
        tableNameForIntermediate: "project_submission",
        linkName: "submissions",
    },
    "Work Submission": {
        label: "Work Submission",
        plural: "Work Submissions",
        tableName: "work_submissions",
        tableNameForIntermediate: "work_submission",
        linkName: "work-submissions",
    },
    "Issue": {
        label: "Issue",
        plural: "Issues",
        tableName: "issues",
        tableNameForIntermediate: "issue",
        linkName: "issues",
    },
    "Project Issue": {
        label: "Project Issue",
        plural: "Project Issues",
        tableName: "project_issues",
        tableNameForIntermediate: "project_issue",
        linkName: "issues",
    },
    "Work Issue": {
        label: "Work Issue",
        plural: "Work Issues",
        tableName: "work_issues",
        tableNameForIntermediate: "work_issue",
        linkName: "issues",
    },
    "Review": {
        label: "Review",
        plural: "Reviews",
        tableName: "reviews",
        tableNameForIntermediate: "review",
        linkName: "reviews",
    },
    "Project Review": {
        label: "Project Review",
        plural: "Project Reviews",
        tableName: "project_reviews",
        tableNameForIntermediate: "project_review",
        linkName: "reviews",
    },
    "Work Review": {
        label: "Work Review",
        plural: "Work Reviews",
        tableName: "work_reviews",
        tableNameForIntermediate: "work_review",
        linkName: "reviews",
    },
    "Project Version": {
        label: "Project Version",
        plural: "Project Versions",
        tableName: "project_versions",
        tableNameForIntermediate: "project_version",
        linkName: "project-versions",
    },
    "Work Version": {
        label: "Work Version",
        plural: "Work Versions",
        tableName: "work_versions",
        tableNameForIntermediate: "work_version",
        linkName: "work-versions",
    },
    "Discussion": {
        label: "Discussion",
        plural: "Discussions",
        tableName: "discussions",
        tableNameForIntermediate: "discussion",
        linkName: "discussions",
    },
    "Chat": {
        label: "Chat",
        plural: "Chats",
        tableName: "chats",
        tableNameForIntermediate: "chat",
        linkName: "chats",
    },
    "Team": {
        label: "Team",
        plural: "Teams",
        tableName: "teams",
        tableNameForIntermediate: "team",
        linkName: "teams",
    },
    "Plan": {
        label: "Plan",
        plural: "Plans",
        tableName: "plans",
        tableNameForIntermediate: "plan",
        linkName: "plans",
    }
};

export const getObjectNames = (
    properties: Partial<ObjectNames>
): ObjectNames | undefined => {
    return Object.values(objectNames).find((info) =>
        Object.keys(properties).every(
            (key) =>
                info[key as keyof ObjectNames] ===
                properties[key as keyof ObjectNames]
        )
    );
};
