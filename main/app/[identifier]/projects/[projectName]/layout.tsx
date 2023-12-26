import { WorkspaceGeneralSearchProvider } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
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
    const projectLayout = await fetchProjectData(supabase, projectId, true);

    return (
        <main>
            <ProjectDataProvider initialProjectLayout={projectLayout.data[0]}>
                <ProjectGeneralSearchProvider>
                    <WorkspaceGeneralSearchProvider>
                        <ProjectHeader
                            initialProjectLayout={(projectLayout.data || [])[0]}
                            projectName={projectName}
                            initialIsLoading={projectLayout.isLoading}
                        />
                        {children}
                    </WorkspaceGeneralSearchProvider>
                </ProjectGeneralSearchProvider>
            </ProjectDataProvider>
        </main>
    );
}
