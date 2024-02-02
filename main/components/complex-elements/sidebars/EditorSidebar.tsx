// EditorSidebar.tsx
"use client";

import React from "react";
import { useEditorSidebarState } from "@/contexts/sidebar-contexts/EditorSidebarContext";
import DirectoryItemsUI from "./DirectoryItemsUI";
import EditorSidebarDropdown from "./EditorSidebarDropdown";
import EditorCollapsedSidebar from "./EditorCollapsedSidebar";

/**
 * Specialized Sidebar for the UnifiedEditor.
 * To be used only once UnifiedEditor is implemented.
 */
const EditorSidebar = () => {
    // Contexts
    const { isEditorSidebarOpen } = useEditorSidebarState();

    if (!isEditorSidebarOpen) {
        return (
            <div className={`absolute h-full`}>
                <EditorCollapsedSidebar />
            </div>
        );
    }

    return (
        <div
            className={`flex-none fixed bg-gray-100 overflow-y-auto shadow-md rounded-tr-lg rounded-br-lg`}
            style={{ height: "calc(100vh - 4rem)" }}
        >
            <aside className="w-64 bg-gray-100 border-r border-gray-300 scroll-subtle z-10 flex flex-col">
                <EditorSidebarDropdown />
                <DirectoryItemsUI />
            </aside>
        </div>
    );
};

export default EditorSidebar;
