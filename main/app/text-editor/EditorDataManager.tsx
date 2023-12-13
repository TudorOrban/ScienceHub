import { useEffect } from "react";
import { useUserId } from "../contexts/current-user/UserIdContext";
import { useEditorContext } from "../contexts/general/EditorContext";
import { useEditorSidebarState } from "../contexts/sidebar-contexts/EditorSidebarContext";
import useEditorSettings from "../hooks/utils/useEditorSettings";
import useProjectData from "../hooks/fetch/data-hooks/projects/useProjectDataTest";
import { useProjectSubmissionData } from "../hooks/fetch/data-hooks/management/useProjectSubmissionData";
import { findAllFinalVersionWorksData, reconstructWorkData } from "../version-control-system/diff-logic/findAllFinalVersionWorksData";
import { transformProjectLayoutToProjectDirectory } from "@/utils/transformProjectLayoutToProjectDirectory";
import deepEqual from "fast-deep-equal";
import { useProjectSubmissionsSearch } from "../hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";

interface EditorDataManagerProps {

}

const EditorDataManager: React.FC<EditorDataManagerProps> = () => {
    // Contexts
    const currentUserId = useUserId();

    // - Editor
    const {
        initializedEditor,
        setInitializedEditor,
        openedProject,
        setOpenedProject,
        projectDirectory,
        setProjectDirectory,
        activeWindows,
        setActiveWindows,
        openedWorkIdentifiers,
        setOpenedWorkIdentifiers,
        openedWorks,
        setOpenedWorks,
        currentWindow,
        setCurrentWindow,
        currentWork,
        setCurrentWork,
        projectSubmissions,
        setProjectSubmissions,
        selectedSubmission,
        setSelectedSubmission,
        workSubmissions,
        setWorkSubmissions
    } = useEditorContext();
    
    // - Editor Sidebar
    const editorSidebarState = useEditorSidebarState();
    const { isEditorSidebarOpen, directoryItems, setDirectoryItems } = editorSidebarState;

    // Fetch editor settings
    const editorSettingsData = useEditorSettings(
        currentUserId || "",
        !!currentUserId
    );

    // Initialize editor context with user settings data
    // when it becomes available and if context isn't already initialized
            // console.log("DATA", initializedEditor,  openedProject, openedWorkIdentifiers, openedWorks, activeWindows, selectedSubmission);
    useEffect(() => {
        if (!initializedEditor) {
            const userOpenedProject =
                openedProject || editorSettingsData.data[0]?.editorSettings?.openedProject;
            const userOpenedWorkIdentifiers =
                openedWorkIdentifiers ||
                editorSettingsData.data[0]?.editorSettings?.openedWorkIdentifiers;
            const userSelectedSubmission =
                selectedSubmission ||
                editorSettingsData.data[0]?.editorSettings?.openedProjectSubmission;

            if (!openedProject && !!userOpenedProject) {
                setOpenedProject(userOpenedProject);
            }
            if (!openedWorkIdentifiers && !!userOpenedWorkIdentifiers) {
                setOpenedWorkIdentifiers(userOpenedWorkIdentifiers);
                // Windows initialization
                if (!activeWindows || activeWindows.length === 0) {
                    const userActiveWindows = Array.from(
                        { length: Object.keys(userOpenedWorkIdentifiers).length || 1 },
                        (_, i) => i + 1
                    );
                    setActiveWindows(userActiveWindows);
                    const newCurrentWork = Object.fromEntries(
                        userActiveWindows.map((window) => [window, 1])
                    );
                    setCurrentWork(newCurrentWork);
                }
            }
            if (!selectedSubmission) {
                setSelectedSubmission(userSelectedSubmission);
            }
            setInitializedEditor(!!editorSettingsData.data[0]);
        }
    }, [editorSettingsData.data]);

    // Fetch project small data for directory display and for finding current project version
    const projectData = useProjectData(openedProject?.id || 0, !!openedProject);

    // If selected submission's initial version id is the current version, *don't* use Rust microservice
    const useMainServiceFetch =
        selectedSubmission?.initialProjectVersionId?.toString() ===
        projectData.data[0]?.currentProjectVersion?.toString();

    // Fetch works that have not already been fetched
    const flatWorkIdentifiers = Object.values(openedWorkIdentifiers || {}).flatMap((windowWorks) =>
        Object.values(windowWorks)
    );
    const flatWorks = Object.values(openedWorks || {}).flatMap((windowWorks) =>
        Object.values(windowWorks)
    );

    const toBeFetchedWorksIdentifiers = flatWorkIdentifiers.filter((workIdentifier) => {
        for (const work of flatWorks) {
            if (
                workIdentifier.workId === work.id.toString() &&
                workIdentifier.workType === work.workType
            ) {
                return false;
            }
        }
        return true;
    });

    const projectSubmissionsData = useProjectSubmissionsSearch({
        tableFilters: { project_id: openedProject?.id },
        enabled: !!openedProject?.id,
        context: "Workspace General",
        itemsPerPage: 50,
    })

    // Fetch project submission data, including all work submissions with their deltas
    const selectedProjectSubmissionData = useProjectSubmissionData(
        selectedSubmission?.id.toString() || "",
        !!selectedSubmission && useMainServiceFetch,
        true
    );

    // Fetch work data, delta data, apply deltas and order according to userOpenedWorkIdentifiers
    const finalVersionWorksData = findAllFinalVersionWorksData({
        openedWorkIdentifiers: toBeFetchedWorksIdentifiers,
        workSubmissions: selectedProjectSubmissionData.data[0]?.workSubmissions,
        enabled:
            useMainServiceFetch &&
            !!toBeFetchedWorksIdentifiers &&
            !!selectedProjectSubmissionData.data[0]?.workSubmissions,
    });

    // Set projectDirectory and
    useEffect(() => {
        if (!!projectData.data[0] && !!selectedProjectSubmissionData.data[0]?.workSubmissions) {
            const projectDirectoryResult = transformProjectLayoutToProjectDirectory(
                projectData.data[0], selectedProjectSubmissionData.data[0]?.workSubmissions
            );
            if (!deepEqual(projectDirectory, projectDirectoryResult)) {
                setProjectDirectory(projectDirectoryResult);
            }
            if (projectDirectoryResult.items !== directoryItems) {
                setDirectoryItems(projectDirectoryResult.items);
            }
        }
    }, [projectData.data, selectedProjectSubmissionData.data]);

    // Sync openedWorks with openedWorkIdentifiers
    useEffect(() => {
        const reconstructedWorks = reconstructWorkData({
            openedWorkIdentifiers: openedWorkIdentifiers || {},
            finalVersionWorks: [
                ...flatWorks,
                ...finalVersionWorksData.data
            ],
        });
        if (!!finalVersionWorksData && !deepEqual(openedWorks, reconstructedWorks)) {
            setOpenedWorks(
                reconstructedWorks
            );
        }
        
    }, [finalVersionWorksData.data]);

    useEffect(() => {
        if ((!projectSubmissions || projectSubmissions.length === 0) && !!projectSubmissionsData?.data) {
            setProjectSubmissions(projectSubmissionsData.data);
        }
    }, [projectSubmissionsData.data]);

    useEffect(() => {
        if ((!workSubmissions || workSubmissions.length === 0) && !!selectedProjectSubmissionData?.data) {
            setWorkSubmissions(selectedProjectSubmissionData.data[0]?.workSubmissions);
        }
    }, [selectedProjectSubmissionData.data]);

    return null;
}

export default EditorDataManager;