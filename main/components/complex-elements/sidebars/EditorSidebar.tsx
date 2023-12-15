// EditorSidebar.tsx
"use client";

import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import { useEditorSidebarState } from "@/contexts/sidebar-contexts/EditorSidebarContext";
import { EditorContext } from "@/contexts/general/EditorContext";
import DirectoryItemsUI from "./DirectoryItemsUI";
import EditorSidebarDropdown from "./EditorSidebarDropdown";
import EditorCollapsedSidebar from "./EditorCollapsedSidebar";
import { useSidebarState } from "@/contexts/sidebar-contexts/SidebarContext";

const EditorSidebar = () => {
    // Contexts
    const pathname = usePathname();
    const editorSidebarState = useEditorSidebarState();
    const { isEditorSidebarOpen, setSelectedItem, setDirectoryItems } =
        editorSidebarState;
    const sidebarState = useSidebarState();
    const { isSidebarOpen } = sidebarState;

    const editorContext = useContext(EditorContext);
    if (!editorContext) {
        throw new Error("EditorContext must be used within an EditorProvider");
    }
    const { projectDirectory, setProjectDirectory } = editorContext;

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
