import { ProjectDirectory, ProjectSmall } from "@/types/projectTypes";
import { CodeBlock, Work, WorkSmall } from "@/types/workTypes";
import { useContext, useEffect, useState } from "react";

import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";
import { MathInline } from "@/utils/Math.extension";
import { Palette } from "./Palette";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size"; // maybe remove in the future
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import dynamic from "next/dynamic";
import { useEditorContext } from "../contexts/general/EditorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getObjectNames } from "@/utils/getObjectNames";
import { workTypeIconMap } from "@/components/elements/SmallWorkCard";
import { useEditorSidebarState } from "../contexts/sidebar-contexts/EditorSidebarContext";
import EditorSidebar from "@/components/complex-elements/sidebars/EditorSidebar";
import { computeTextDiff } from "../version-control-system/computeTextDiff";
import { calculateDiffs } from "../version-control-system/diff-logic/calculateDiffs";
import { applyTextDiffs } from "../version-control-system/diff-logic/applyTextDiff";
import { useUpdateGeneralData } from "../hooks/update/useUpdateGeneralData";
import { ProjectDelta } from "@/types/versionControlTypes";
import { useSaveLogic } from "../version-control-system/hooks/useSaveLogic";
import { useProjectDelta } from "../hooks/fetch/data-hooks/management/useProjectDelta";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import VersionControlPanel from "@/components/complex-elements/NewEditModeUI";
import useEditorSettings from "../hooks/utils/useEditorSettings";
import { useUserId } from "../contexts/current-user/UserIdContext";
import useProjectData from "../hooks/fetch/data-hooks/projects/useProjectDataTest";
import { transformProjectLayoutToProjectDirectory } from "@/utils/transformProjectLayoutToProjectDirectory";
import { createUseUnifiedSearch } from "../hooks/fetch/search-hooks/useUnifiedSearch";
import { SelectOption } from "@/components/light-simple-elements/Select";
import { useProjectSubmissionData } from "../hooks/fetch/data-hooks/management/useProjectSubmissionData";
import { applyWorkDelta } from "../version-control-system/diff-logic/applyWorkDelta";
import { workTypes } from "@/utils/navItems.config";
import { findFinalVersionWorkData } from "../version-control-system/diff-logic/findFinalVersionWorkData";
import { findAllFinalVersionWorksData } from "../version-control-system/diff-logic/findAllFinalVersionWorksData";
import deepEqual from "fast-deep-equal";
import WorkEditor from "./WorkEditor";

// import Collaboration from "@tiptap/extension-collaboration";
// import * as Y from "yjs";
// import { HocuspocusProvider } from "@hocuspocus/provider";
// import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

const EditorContent = dynamic(() => import("@tiptap/react").then((mod) => mod.EditorContent));

// Real time Collaboration Setup
// const ydoc = new Y.Doc();
// // Registered with a WebRTC provider
// const provider = new HocuspocusProvider({
//     url: "ws://127.0.0.1:1234",
//     name: "example-document",
// });

const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4, 5],
        },
        // The Collaboration extension comes with its own history handling
        history: false,
    }),
    // Register the document with Tiptap
    // Collaboration.configure({
    //     document: provider.document,
    // }),
    // // Register the collaboration cursor extension
    // CollaborationCursor.configure({
    //     provider: provider,
    //     user: {
    //         name: "Cyndi Lauper",
    //         color: "#f783ac",
    //     },
    // }),
    Underline,
    MathInline,
    TextStyle,
    FontFamily,
    FontSize,
    Color,
    TextAlign,
];

const editorProps = {
    attributes: {
        // class: "z-10 w-[595px] h-[842px] flex-none focus:outline-none bg-white border-x border-gray-200 shadow-sm",
        class: "z-10 w-[120px] h-[842px] flex-none focus:outline-none bg-white border-x border-gray-200 shadow-sm",
    },
};

interface UnifiedEditorProps {}

const UnifiedEditor: React.FC<UnifiedEditorProps> = ({}) => {
    // States
    const [currentFocusedEditor, setCurrentFocusedEditor] = useState<Editor | null>(null);

    // Contexts
    const currentUserId = useUserId();

    // - Editor
    const {
        activeWindows,
        setActiveWindows,
        openedProject,
        setOpenedProject,
        projectDirectory,
        setProjectDirectory,
        openedWorks,
        setOpenedWorks,
        currentWindow,
        setCurrentWindow,
        currentWork,
        setCurrentWork,
        selectedSubmission,
        setSelectedSubmission,
    } = useEditorContext();

    // - Editor Sidebar
    const editorSidebarState = useEditorSidebarState();
    const { isEditorSidebarOpen, directoryItems, setDirectoryItems } = editorSidebarState;

    // console.log("EDITOR HTML", editor?.getHTML());

    // Fetch editor settings and associated data
    // - Fetch
    const editorSettingsData = useEditorSettings(currentUserId || "", !!currentUserId);

    // - User last used data
    const userOpenedProject =
        openedProject || editorSettingsData.data[0]?.editorSettings?.openedProject;
    const userOpenedWorkIdentifiers =
        editorSettingsData.data[0]?.editorSettings?.openedWorkIdentifiers;
    const userSelectedSubmission =
        editorSettingsData.data[0]?.editorSettings?.openedProjectSubmission;

    // Fetch project small data for directory display and for finding current project version
    const projectData = useProjectData(
        userOpenedProject?.id || 0,
        !!editorSettingsData.data[0]?.editorSettings?.openedProject?.id
    );

    // If selected submission's initial version id is the current version, *don't* use Rust microservice
    const useMainServiceFetch =
        userSelectedSubmission?.initialProjectVersionId?.toString() ===
        projectData.data[0]?.currentProjectVersion?.toString();

    // Fetch project submission data, including all work submissions with their deltas
    const projectSubmissionsData = useProjectSubmissionData(
        userSelectedSubmission?.id.toString() || "",
        !!userSelectedSubmission && useMainServiceFetch,
        true
    );

    // Use project directory and selected submission for display
    useEffect(() => {
        if (!!projectData.data[0]) {
            const projectDirectoryResult: ProjectDirectory =
                transformProjectLayoutToProjectDirectory(projectData.data[0]);
            setProjectDirectory(projectDirectoryResult);
        }
        if (!!userOpenedWorkIdentifiers) {
            setActiveWindows(
                Array.from(
                    { length: Object.keys(userOpenedWorkIdentifiers)?.length || 1 },
                    (_, i) => i + 1
                )
            );
        }

        if (!!userSelectedSubmission) {
            setSelectedSubmission({
                label: userSelectedSubmission.title || userSelectedSubmission.id.toString(),
                value: userSelectedSubmission.id.toString(),
            });
        }
    }, [projectData.data[0], userOpenedWorkIdentifiers, userSelectedSubmission]);

    useEffect(() => {
        if (!!activeWindows) {
            const newCurrentWork = Object.fromEntries(activeWindows.map((window) => [window, 1]));
            setCurrentWork(newCurrentWork);
        }
    }, [activeWindows]);

    // Fetch work data, delta data, apply deltas and order according to userOpenedWorkIdentifiers
    const finalVersionWorks: Record<number, Record<number, Work>> = findAllFinalVersionWorksData({
        userOpenedWorkIdentifiers: userOpenedWorkIdentifiers || {},
        workSubmissions: projectSubmissionsData.data[0]?.workSubmissions || [],
        enabled: !!userOpenedWorkIdentifiers && !!projectSubmissionsData.data[0]?.workSubmissions,
    });

    useEffect(() => {
        if (!!projectData.data[0] && !deepEqual(finalVersionWorks, openedWorks)) {
            setOpenedWorks(finalVersionWorks);
        }
    }, [finalVersionWorks]);

    const isMainAuthor = projectData.data[0]?.users
        ?.map((user) => user.id)
        .includes(currentUserId || "");

    // console.log("OQEOIOWQEQOW", currentWindow, currentWork[currentWindow]);
    // // Tiptap Editor Hook
    // console.log("SDSAODSADA", currentFocusedEditor);

    useEffect(() => {
        if (projectDirectory && projectDirectory.items !== directoryItems) {
            setDirectoryItems(projectDirectory.items);
        }
    }, [projectDirectory]);

    // Getting data ready for display
    const submissionsOptions: SelectOption[] =
        projectSubmissionsData.data.map((submission) => {
            return {
                label: submission.title || submission.id.toString(),
                value: submission.id.toString(),
            };
        }) || [];

    return (
        <div className="w-full flex flex-row">
            <EditorSidebar />
            <div className={`w-full ${isEditorSidebarOpen ? "ml-64" : "ml-12"} overflow-y-auto`}>
                <VersionControlPanel
                    projectSubmissions={submissionsOptions}
                    submissionInitialProjectVersion={""}
                    submissionFinalProjectVersion={""}
                    handleSave={() => {}}
                />
                {currentFocusedEditor && (
                    <Palette editor={currentFocusedEditor} onSave={() => {}} />
                )}
                <div className="flex flex-row">
                    {activeWindows &&
                        activeWindows.length > 0 &&
                        activeWindows.map((window, index) => (
                            // window
                            <div
                                key={index}
                                className="w-full border-r-2 border-gray-500 shadow-sm"
                            >
                                {/* Cards */}
                                <div className="flex items-center bg-gray-50 space-x-0 border-b border-gray-200 overflow-x-auto">
                                    {openedWorks &&
                                        Object.keys(openedWorks).includes(window.toString()) &&
                                        Object.values(openedWorks[window]).map((work, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center min-w-20 p-2 border border-gray-200 rounded-t-md ${
                                                    work.id ===
                                                    openedWorks[window][currentWork[window]]?.id
                                                        ? "bg-gray-200"
                                                        : "bg-white"
                                                }`}
                                            >
                                                <button
                                                    onClick={() =>
                                                        setCurrentWork({
                                                            ...currentWork,
                                                            [window]: index + 1,
                                                        })
                                                    }
                                                    className="flex items-center whitespace-nowrap max-w-32 truncate"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            workTypeIconMap(work.workType || "")
                                                                .icon || faQuestion
                                                        }
                                                        className="ml-2 mr-1 "
                                                        style={{
                                                            color:
                                                                workTypeIconMap(work.workType || "")
                                                                    .color || "#22222",
                                                            fontSize: "14px",
                                                        }}
                                                    />
                                                    {work.title}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Current window's works
                                                        const currentWindowWorks =
                                                            openedWorks[window];

                                                        // Filter out the work you want to close
                                                        const { [work.id]: _, ...filteredWorks } =
                                                            currentWindowWorks;

                                                        // Update the state with the filtered works
                                                        setOpenedWorks({
                                                            ...openedWorks,
                                                            [window]: filteredWorks,
                                                        });

                                                        // Check and update currentWork if the closed work is the current work
                                                        if (currentWork[window] === work.id) {
                                                            const remainingWorkIds =
                                                                Object.keys(filteredWorks).map(
                                                                    Number
                                                                );

                                                            if (remainingWorkIds.length > 0) {
                                                                // Set to next available work if there are remaining works
                                                                setCurrentWork({
                                                                    ...currentWork,
                                                                    [window]: remainingWorkIds[0],
                                                                });
                                                            } else {
                                                                // Remove the current work entry for the window if no works are left
                                                                const {
                                                                    [window]: _,
                                                                    ...updatedCurrentWork
                                                                } = currentWork;
                                                                setCurrentWork(updatedCurrentWork);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                        className="small-icon text-gray-700 hover:text-red-700 ml-2 mr-1"
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                                {/* Editor for current work*/}
                                <div className="bg-gray-300">
                                    {!!openedWorks && !!openedWorks[window] && (
                                        <WorkEditor
                                            keyProp={openedWorks[window][currentWork[window]].id.toString()}
                                            work={openedWorks[window][currentWork[window]]}
                                            onFocus={(editor: Editor | null) =>
                                                setCurrentFocusedEditor(editor)
                                            }
                                            extensions={extensions}
                                            editorProps={{
                                                attributes: {
                                                    class: "z-10 w-[595px] h-[842px] flex-none focus:outline-none bg-white border border-gray-500 shadow-sm",
                                                },
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default UnifiedEditor;

// // Version control
// const projectDeltaData = useProjectDelta("1", true);
// const projectDelta = projectDeltaData?.data[0];

// // Save logic
// const supabase = useSupabaseClient();
// const { mutateAsync: updateProjectDeltaMutation } = useUpdateGeneralData<ProjectDelta>();

// let reconstructedDescription: string = currentWork[currentWindow].description || "";

// const handleSaveFile = async () => {
//     if (typeof currentWork[currentWindow].description === "string" && !!editor?.getHTML) {
//         // Compute text diff from content HTML
//         const textDiff = calculateDiffs(
//             currentWork[currentWindow].description!,
//             editor?.getHTML()
//         );
//         // console.log(
//         //     "TEXT DIFF",
//         //     currentWork[currentWindow].description,
//         //     textDiff
//         // );

//         // Save
//         const updateFieldsSnakeCase: Partial<ProjectDelta> = {
//             delta_data: {
//                 ...projectDelta.deltaData,
//                 description: textDiff,
//             },
//             initial_project_version_id: projectDelta.initialProjectVersionId,
//             final_project_version_id: projectDelta.finalProjectVersionId,
//         } as unknown as Partial<ProjectDelta>;

//         // Update the database
//         await updateProjectDeltaMutation({
//             supabase: supabase,
//             tableName: "project_deltas",
//             identifierField: "id",
//             identifier: projectDelta.id,
//             updateFields: updateFieldsSnakeCase,
//         });

//         // Reconstruct text for editor content
//         reconstructedDescription = applyTextDiffs(
//             currentWork[currentWindow].description || "",
//             textDiff
//         );
//         console.log(
//             "Reconstruction",
//             reconstructedDescription,
//             reconstructedDescription === editor.getHTML()
//         );
//     }
// };
