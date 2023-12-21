import { WorkspaceGeneralSearchProvider } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { CurrentFieldsVersionsProvider } from "@/contexts/search-contexts/version-control/CurrentFieldsVersionsContext";
import { fetchProjectIdByName } from "@/services/utils/fetchProjectIdByName";
import { fetchProjectData } from "@/services/fetch/fetchProjectDataTest";
import ProjectHeader from "@/components/headers/ProjectHeader";
import supabase from "@/utils/supabase";
import { ProjectDataProvider } from "@/contexts/project/ProjectDataContext";
import { ProjectGeneralSearchProvider } from "@/contexts/search-contexts/ProjectGeneralContext";

export const revalidate = 3600;

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
                            <CurrentFieldsVersionsProvider>
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
                            </CurrentFieldsVersionsProvider>
                    </WorkspaceGeneralSearchProvider>
                </ProjectGeneralSearchProvider>
            </ProjectDataProvider>
        </main>
    );
}
