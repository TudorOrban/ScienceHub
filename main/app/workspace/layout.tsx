import React from "react";
import { WorkspaceGeneralSearchProvider } from "../contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import type { Metadata } from "next";
import WorkspaceOverviewHeader from "@/components/headers/WorkspaceOverviewHeader";
import { EditorSidebarProvider } from "../contexts/sidebar-contexts/EditorSidebarContext";

export const metadata: Metadata = {
    title: "Workspace",
    description: "A unified space for scientific work",
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <WorkspaceGeneralSearchProvider>
            <EditorSidebarProvider initialDirectoryItems={[]}>
                <main>
                    <WorkspaceOverviewHeader />
                    {children}
                </main>
            </EditorSidebarProvider>
        </WorkspaceGeneralSearchProvider>
    );
}
