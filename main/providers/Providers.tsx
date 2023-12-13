// Body.tsx
"use client";

import React from "react";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider } from "@/app/contexts/sidebar-contexts/SidebarContext";
import ReactQueryProvider from "./ReactQueryProvider";
import { ProjectProvider } from "@/app/contexts/general/ProjectContext";
import { UserbarProvider } from "@/app/contexts/sidebar-contexts/UserbarContext";
import { workspaceNavItems } from "@/utils/navItems.config";
import { UserIdProvider } from "@/app/contexts/current-user/UserIdContext";
import { Toaster } from "@/components/ui/toaster";
import { DeleteModeProvider } from "@/app/contexts/general/DeleteModeContext";
import { UsersSelectionProvider } from "@/app/contexts/selections/UsersSelectionContext";
import { ProjectSelectionProvider } from "@/app/contexts/selections/ProjectSelectionContext";
import { WorkSelectionProvider } from "@/app/contexts/selections/WorkSelectionContext";
import TRPCProvider from "@/app/_trpc/Provider";
import { PageSelectProvider } from "@/app/contexts/general/PageSelectContext";
import BrowseProviders from "./BrowseProviders";
import SearchProviders from "./SearchProviders";
import { EditorProvider } from "@/app/contexts/general/EditorContext";
import { UserSettingsProvider } from "@/app/contexts/current-user/UserSettingsContext";
import { UserActionsProvider } from "@/app/contexts/current-user/UserActionsContext";
import { UserSmallDataProvider } from "@/app/contexts/current-user/UserSmallData";
import { WorkEditModeProvider } from "@/app/contexts/search-contexts/version-control/WorkEditModeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ReactQueryProvider>
                <SupabaseProvider>
                    <TRPCProvider>
                        <UserProvider>
                            <UserIdProvider>
                                <UserSmallDataProvider>
                                    <UserSettingsProvider>
                                        <UserActionsProvider>
                                            <ToasterProvider />
                                            <Toaster />
                                            <ModalProvider />
                                            <ThemeProvider>
                                                <SidebarProvider
                                                    initialNavItems={workspaceNavItems}
                                                >
                                                    <UserbarProvider
                                                        initialNavItems={workspaceNavItems}
                                                    >
                                                        <SearchProviders>
                                                            <ProjectProvider>
                                                                <DeleteModeProvider>
                                                                    <UsersSelectionProvider>
                                                                        <ProjectSelectionProvider>
                                                                            <WorkSelectionProvider>
                                                                                <PageSelectProvider>
                                                                                    <WorkEditModeProvider>
                                                                                        <EditorProvider>
                                                                                            <BrowseProviders>
                                                                                                {
                                                                                                    children
                                                                                                }
                                                                                            </BrowseProviders>
                                                                                        </EditorProvider>
                                                                                    </WorkEditModeProvider>
                                                                                </PageSelectProvider>
                                                                            </WorkSelectionProvider>
                                                                        </ProjectSelectionProvider>
                                                                    </UsersSelectionProvider>
                                                                </DeleteModeProvider>
                                                            </ProjectProvider>
                                                        </SearchProviders>
                                                    </UserbarProvider>
                                                </SidebarProvider>
                                            </ThemeProvider>
                                        </UserActionsProvider>
                                    </UserSettingsProvider>
                                </UserSmallDataProvider>
                            </UserIdProvider>
                        </UserProvider>
                    </TRPCProvider>
                </SupabaseProvider>
            </ReactQueryProvider>
        </div>
    );
}
