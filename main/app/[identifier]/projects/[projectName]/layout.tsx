import { ProjectEditModeProvider } from "@/app/contexts/search-contexts/version-control/ProjectEditModeContext";
import { WorkspaceGeneralSearchProvider } from "@/app/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { CurrentFieldsVersionsProvider } from "@/app/contexts/search-contexts/version-control/CurrentFieldsVersionsContext";
import { EditorSidebarProvider } from "@/app/contexts/sidebar-contexts/EditorSidebarContext";
import { fetchProjectIdByName } from "@/services/utils/fetchProjectIdByName";
import { fetchProjectData } from "@/services/fetch/fetchProjectDataTest";
import ProjectHeader from "@/components/headers/ProjectHeader";
import supabase from "@/utils/supabase";
import { ProjectDataProvider } from "@/app/contexts/project/ProjectDataContext";
import { ProjectGeneralSearchProvider } from "@/app/contexts/search-contexts/ProjectGeneralContext";

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        identifier: string;
        projectName: string;
    };
}) {
    const { identifier, projectName } = params;
    const projectId = await fetchProjectIdByName(supabase, projectName);
    const projectLayout = await fetchProjectData(supabase, projectId);

    return (
        <main>
            <ProjectDataProvider initialProjectLayout={projectLayout.data[0]}>
                <ProjectGeneralSearchProvider>
                    <WorkspaceGeneralSearchProvider>
                        <ProjectEditModeProvider>
                            <CurrentFieldsVersionsProvider>
                                <EditorSidebarProvider
                                    initialDirectoryItems={[]}
                                >
                                    <ProjectHeader
                                        initialProjectLayout={
                                            (projectLayout.data || [])[0]
                                        }
                                        projectName={projectName}
                                        initialIsLoading={
                                            projectLayout.isLoading
                                        }
                                    />
                                    {children}
                                </EditorSidebarProvider>
                            </CurrentFieldsVersionsProvider>
                        </ProjectEditModeProvider>
                    </WorkspaceGeneralSearchProvider>
                </ProjectGeneralSearchProvider>
            </ProjectDataProvider>
        </main>
    );
}
