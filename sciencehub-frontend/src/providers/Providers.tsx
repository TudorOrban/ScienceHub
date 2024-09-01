"use client";

import React from "react";
import SupabaseProvider from "@/src/providers/SupabaseProvider";
import ToasterProvider from "@/src/providers/ToasterProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider } from "@/src/contexts/sidebar-contexts/SidebarContext";
import ReactQueryProvider from "./ReactQueryProvider";
import { UserbarProvider } from "@/src/contexts/sidebar-contexts/UserbarContext";
import { workspaceNavItems } from "@/src/config/navItems.config";
import { Toaster } from "@/src/components/ui/toaster";
import { DeleteModeProvider } from "@/src/contexts/general/DeleteModeContext";
import { UsersSelectionProvider } from "@/src/contexts/selections/UsersSelectionContext";
import { ProjectSelectionProvider } from "@/src/contexts/selections/ProjectSelectionContext";
import { WorkSelectionProvider } from "@/src/contexts/selections/WorkSelectionContext";
import TRPCProvider from "@/src/app/_trpc/Provider";
import { PageSelectProvider } from "@/src/contexts/general/PageSelectContext";
import BrowseProviders from "./BrowseProviders";
import SearchProviders from "./SearchProviders";
import { EditorProvider } from "@/src/contexts/general/EditorContext";
import { WorkEditModeProvider } from "@/src/modules/version-control-system/contexts/WorkEditModeContext";
import { CustomToastProvider } from "@/src/contexts/general/ToastsContext";
import ToastManager from "@/src/components/complex-elements/ToastManager";
import { ProjectEditModeProvider } from "@/src/modules/version-control-system/contexts/ProjectEditModeContext";
import { ProjectSubmissionSelectionProvider } from "@/src/contexts/selections/ProjectSubmissionSelectionContext";
import UserProviders from "./UserProviders";
import { WorkSubmissionSelectionProvider } from "@/src/contexts/selections/WorkSubmissionSelectionContext";

/**
 * The global providers for the website
 */
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
                                            <DeleteModeProvider>
                                                <UsersSelectionProvider>
                                                    <ProjectSelectionProvider>
                                                        <WorkSelectionProvider>
                                                            <ProjectSubmissionSelectionProvider>
                                                                <WorkSubmissionSelectionProvider>
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
                                                                </WorkSubmissionSelectionProvider>
                                                            </ProjectSubmissionSelectionProvider>
                                                        </WorkSelectionProvider>
                                                    </ProjectSelectionProvider>
                                                </UsersSelectionProvider>
                                            </DeleteModeProvider>
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
