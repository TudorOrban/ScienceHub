import { Bookmark } from "@/types/communityTypes";
import { ProjectSmall } from "@/types/projectTypes";
import { Submission } from "@/types/versionControlTypes";
import { WorkSmall } from "@/types/workTypes";
import { useProjectsSmallSearch } from "../fetch/search-hooks/projects/useProjectsSmallSearch";
import { HookResult } from "../fetch/useGeneralData";
import { useWorksSmallSearch } from "../fetch/search-hooks/works/useWorksSmallSearch";

export type BookmarkDataType = "Project" 

export type BookmarksData = {
    projectData?: HookResult<ProjectSmall>;
    workData?: HookResult<WorkSmall>;
    submissionData?: HookResult<Submission>;
};

export const useBookmarksData = (
    projectBookmarks?: Bookmark[],
    workBookmarks?: Bookmark[],
    submissionBookmarks?: Bookmark[]
): BookmarksData => {
    const projectIds = projectBookmarks?.map((project) => project.objectId.toString());
    const projectData = useProjectsSmallSearch({
        tableRowsIds: projectIds,
        extraFilters: {},
        enabled: !!projectIds,
        context: "Project General",
    });

    // const workTypes =workBookmarks?.map((work) => work.objectType);
    // const workIds = projectBookmarks?.map((project) => project.objectId.toString());
    // const workData = useWorksSmallSearch({
    //     tableName: workTypes,
    //     tableRowsIds: workIds,
    //     extraFilters: {},
    //     enabled: !!projectIds,
    //     context: "Project General",
    // });
    

    return {
        projectData: projectData,
    }
};
