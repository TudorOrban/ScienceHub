import React from "react";
import { WorkspaceGeneralSearchProvider } from "@/src/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import type { Metadata } from "next";
import { EditorSidebarProvider } from "@/src/contexts/sidebar-contexts/EditorSidebarContext";

export const metadata: Metadata = {
    title: "Workspace",
    description: "A unified space dedicated to managing the current user's data.",
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <WorkspaceGeneralSearchProvider>
            <EditorSidebarProvider initialDirectoryItems={[]}>
                <main>{children}</main>
            </EditorSidebarProvider>
        </WorkspaceGeneralSearchProvider>
    );
}
