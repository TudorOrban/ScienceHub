import {
    DirectoryItem,
    ProjectDirectory,
    ProjectLayout,
} from "@/types/projectTypes";

export const transformProjectLayoutToProjectDirectory = (
    projectLayout: ProjectLayout
): ProjectDirectory => {
    const folderMap: Record<number, DirectoryItem> = {};
    const rootItems: DirectoryItem[] = [];

    // Process folders to create a map of all folders
    projectLayout.folders?.forEach((folder) => {
        const directoryItem: DirectoryItem = {
            id: folder.id,
            title: folder.name,
            itemType: "Folder", // Assuming this is how you identify folders
            subItems: [],
        };

        folderMap[folder.id] = directoryItem;
    });

    // After processing all folders, find the root-level folders
    const rootFolders =
        projectLayout.folders?.filter((f) => f.parentId == null) || [];
    rootFolders.forEach((folder) => {
        rootItems.push(folderMap[folder.id]);
    });

    // Process files and other items recursively
    const processItems = (
        parentId: number | null,
        items: any[],
        itemType: string
    ): DirectoryItem[] => {
        const currentItems: DirectoryItem[] = [];
        items.forEach((item) => {
            const directoryItem: DirectoryItem = {
                id: item.id,
                title: item.name || item.title || "",
                itemType: itemType,
                subItems: [],
            };

            // If the item is a folder, process its contents recursively
            if (itemType === "Folder") {
                directoryItem.subItems = [
                    ...processItems(
                        item.id,
                        projectLayout.folders?.filter(
                            (f) => f.parentId === item.id
                        ) || [],
                        "Folder"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.files?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "File"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.experiments?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "Experiment"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.datasets?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "Dataset"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.dataAnalyses?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "Data Analysis"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.aiModels?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "AI Model"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.codeBlocks?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "Code Block"
                    ),
                    ...processItems(
                        item.id,
                        projectLayout.papers?.filter(
                            (f) => f.folderId === item.id
                        ) || [],
                        "Paper"
                    ),
                    // ... other types as before
                ];
            }

            // Add the directory item to the currentItems array
            currentItems.push(directoryItem);
        });

        // If parentId is null, return the items to be added at the root level
        if (parentId === null) {
            return currentItems;
        }

        // Otherwise, add the items to the corresponding folder's subItems
        const parentFolder = folderMap[parentId];
        if (parentFolder) {
            parentFolder.subItems.push(...currentItems);
        }

        return [];
    };

    // Start processing from the root level for all types
    processItems(
        null,
        projectLayout.folders?.filter((f) => f.parentId == null) || [],
        "Folder"
    );
    // ... process other types at root level
    // Start processing from the root level for all types
    rootItems.push(
        ...processItems(
            null,
            projectLayout.files?.filter((f) => f.folderId == null) || [],
            "File"
        ),
        ...processItems(
            null,
            projectLayout.experiments?.filter((e) => e.folderId == null) || [],
            "Experiment"
        ),
        ...processItems(
            null,
            projectLayout.datasets?.filter((d) => d.folderId == null) || [],
            "Dataset"
        ),
        ...processItems(
            null,
            projectLayout.dataAnalyses?.filter((da) => da.folderId == null) ||
                [],
            "Data Analysis"
        ),
        ...processItems(
            null,
            projectLayout.aiModels?.filter((a) => a.folderId == null) || [],
            "AI Model"
        ),
        ...processItems(
            null,
            projectLayout.codeBlocks?.filter((c) => c.folderId == null) || [],
            "Code Block"
        ),
        ...processItems(
            null,
            projectLayout.papers?.filter((p) => p.folderId == null) || [],
            "Paper"
        )
        // ... add other types here if necessary
    );

    // Since rootItems may contain duplicates now, filter them out based on IDs
    const uniqueRootItems = rootItems.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    return {
        items: uniqueRootItems,
        currentProjectVersion: projectLayout.currentProjectVersion,
    };
};
// This you idiot:
// processItems(projectLayout.files || [], "File");
// processItems(projectLayout.experiments || [], "Experiment");
// processItems(projectLayout.datasets || [], "Dataset");
// processItems(projectLayout.dataAnalyses || [], "Data Analysis");
// processItems(projectLayout.aiModels || [], "AI Model");
// processItems(projectLayout.codeBlocks || [], "Code Block");
// processItems(projectLayout.papers || [], "Paper");

// processItems(projectLayout.files || [], "File");
// processItems(projectLayout.experiments || [], "Experiment");
// processItems(projectLayout.datasets || [], "Dataset");
// processItems(projectLayout.dataAnalyses || [], "Data Analysis");
// processItems(projectLayout.aiModels || [], "AI Model");
// processItems(projectLayout.codeBlocks || [], "Code Block");
// processItems(projectLayout.papers || [], "Paper");

// if ("id" in content && "parentId" in content) {
//     itemType = "Folder";
// } else if ("fileType" in content) {
//     itemType = "File";
// } else if ("methodology" in content) {
//     itemType = "Experiment";
// } else if ("datasetPath" in content) {
//     itemType = "Dataset";
// } else if ("notebookPath" in content) {
//     itemType = "Data Analysis";
// } else if ("modelPath" in content) {
//     itemType = "AI Model";
// } else if ("code" in content) {
//     itemType = "Code Block";
// } else if ("pdfPath" in content) {
//     itemType = "Paper";
// }
