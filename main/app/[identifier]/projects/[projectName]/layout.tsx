import { WorkspaceGeneralSearchProvider } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { fetchProjectIdByName } from "@/services/utils/fetchProjectIdByName";
import { fetchProjectData } from "@/services/fetch/fetchProjectData";
import ProjectHeader from "@/components/headers/ProjectHeader";
import supabase from "@/utils/supabase";
import { ProjectDataProvider } from "@/contexts/project/ProjectDataContext";
import { ProjectGeneralSearchProvider } from "@/contexts/search-contexts/ProjectGeneralContext";
import { ProjectSmallProvider } from "@/contexts/project/ProjectSmallContext";

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
    // Serverside fetch of initial data. To be refactored
    const { identifier, projectName } = params;
    const projectId = await fetchProjectIdByName(supabase, projectName);
    const projectLayoutData = await fetchProjectData(supabase, projectId, true);
    const projectLayout = projectLayoutData.data[0];

    return (
        <main>
            <ProjectDataProvider initialProjectLayout={projectLayout}>
                <ProjectSmallProvider
                    initialProjectSmall={{
                        id: projectLayout.id,
                        name: projectLayout.name || "",
                        title: projectLayout.title || "",
                    }}
                >
                    <ProjectGeneralSearchProvider>
                        <WorkspaceGeneralSearchProvider>
                            <ProjectHeader
                                initialProjectLayout={projectLayout}
                                projectName={projectName}
                                initialIsLoading={projectLayoutData.isLoading}
                            />
                            {children}
                        </WorkspaceGeneralSearchProvider>
                    </ProjectGeneralSearchProvider>
                </ProjectSmallProvider>
            </ProjectDataProvider>
        </main>
    );
}
