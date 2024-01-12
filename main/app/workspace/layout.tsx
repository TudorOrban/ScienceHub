import React from "react";
import { WorkspaceGeneralSearchProvider } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import type { Metadata } from "next";
import { EditorSidebarProvider } from "@/contexts/sidebar-contexts/EditorSidebarContext";
import { CurrentUserDataProvider } from "@/contexts/current-user/CurrentUserDataContext";

export const metadata: Metadata = {
    title: "Workspace",
    description: "A unified space dedicated to managing the current user's data.",
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <CurrentUserDataProvider>
            <WorkspaceGeneralSearchProvider>
                <EditorSidebarProvider initialDirectoryItems={[]}>
                    <main>
                        {children}
                    </main>
                </EditorSidebarProvider>
            </WorkspaceGeneralSearchProvider>
        </CurrentUserDataProvider>
    );
}
