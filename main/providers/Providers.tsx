// Body.tsx
"use client";

import React from "react";
import SupabaseProvider from "@/providers/SupabaseProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider } from "@/contexts/sidebar-contexts/SidebarContext";
import ReactQueryProvider from "./ReactQueryProvider";
import { ProjectProvider } from "@/contexts/general/ProjectContext";
import { UserbarProvider } from "@/contexts/sidebar-contexts/UserbarContext";
import { workspaceNavItems } from "@/config/navItems.config";
import { Toaster } from "@/components/ui/toaster";
import { DeleteModeProvider } from "@/contexts/general/DeleteModeContext";
import { UsersSelectionProvider } from "@/contexts/selections/UsersSelectionContext";
import { ProjectSelectionProvider } from "@/contexts/selections/ProjectSelectionContext";
import { WorkSelectionProvider } from "@/contexts/selections/WorkSelectionContext";
import TRPCProvider from "@/app/_trpc/Provider";
import { PageSelectProvider } from "@/contexts/general/PageSelectContext";
import BrowseProviders from "./BrowseProviders";
import SearchProviders from "./SearchProviders";
import { EditorProvider } from "@/contexts/general/EditorContext";
import { WorkEditModeProvider } from "@/version-control-system/contexts/WorkEditModeContext";
import { CustomToastProvider } from "@/contexts/general/ToastsContext";
import ToastManager from "@/components/light-simple-elements/ToastManager";
import { ProjectEditModeProvider } from "@/version-control-system/contexts/ProjectEditModeContext";
import { ProjectSubmissionSelectionProvider } from "@/contexts/selections/ProjectSubmissionSelectionContext";
import UserProviders from "./UserProviders";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SupabaseProvider>
            <ReactQueryProvider>
                <TRPCProvider>
                    <UserProviders>
                        <ToasterProvider />
                        <Toaster />
                        <CustomToastProvider>
                            <ToastManager />
                            <ThemeProvider>
                                <SidebarProvider initialNavItems={workspaceNavItems}>
                                    <UserbarProvider initialNavItems={workspaceNavItems}>
                                        <SearchProviders>
                                            <ProjectProvider>
                                                <DeleteModeProvider>
                                                    <UsersSelectionProvider>
                                                        <ProjectSelectionProvider>
                                                            <WorkSelectionProvider>
                                                                <ProjectSubmissionSelectionProvider>
                                                                    <PageSelectProvider>
                                                                        <ProjectEditModeProvider>
                                                                            <WorkEditModeProvider>
                                                                                <EditorProvider>
                                                                                    <BrowseProviders>
                                                                                        {children}
                                                                                    </BrowseProviders>
                                                                                </EditorProvider>
                                                                            </WorkEditModeProvider>
                                                                        </ProjectEditModeProvider>
                                                                    </PageSelectProvider>
                                                                </ProjectSubmissionSelectionProvider>
                                                            </WorkSelectionProvider>
                                                        </ProjectSelectionProvider>
                                                    </UsersSelectionProvider>
                                                </DeleteModeProvider>
                                            </ProjectProvider>
                                        </SearchProviders>
                                    </UserbarProvider>
                                </SidebarProvider>
                            </ThemeProvider>
                        </CustomToastProvider>
                    </UserProviders>
                </TRPCProvider>
            </ReactQueryProvider>
        </SupabaseProvider>
    );
}
