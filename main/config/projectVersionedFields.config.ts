
export const getProjectVersionedFields = () => {
    return [
        "title",
        "description",
    ];
};

export const metadataVersionedFields = [
    {
        key: "doi",
        type: "TextDiff",
    },
    {
        key: "license",
        type: "TextDiff",
    },
    {
        key: "publisher",
        type: "TextDiff",
    },
    {
        key: "conference",
        type: "TextDiff",
    },
    {
        key: "researchGrants",
        type: "ArrayDiff",
    },
    {
        key: "tags",
        type: "ArrayDiff",
    },
    {
        key: "keywords",
        type: "ArrayDiff",
    },
];
