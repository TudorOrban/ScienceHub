import { ProjectDirectory, ProjectSmall } from "@/src/types/projectTypes";
import { CodeBlock, Work, WorkIdentifier, WorkSmall } from "@/src/types/workTypes";
import { useContext, useEffect, useRef, useState } from "react";

import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";
import { MathInline } from "@/src/utils/Math.extension";
import { Palette } from "./Palette";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { useEditorContext } from "@/src/contexts/general/EditorContext";
import { useEditorSidebarState } from "@/src/contexts/sidebar-contexts/EditorSidebarContext";
import EditorSidebar from "@/src/components/complex-elements/sidebars/EditorSidebar";
import VersionControlPanel from "@/src/modules/text-editor/NewEditModeUI";
import WorkEditor from "./WorkEditor";
import WorkCards from "./WorkCards";
import EditorDataManager from "./EditorDataManager";

/**
 * Work in progress: a unified editor for the ScienceHub objects (using TipTap editor)
 * enabling writing of on-site work content, team collaboration, managing version control etc
 */


// import Collaboration from "@tiptap/extension-collaboration";
// import * as Y from "yjs";
// import { HocuspocusProvider } from "@hocuspocus/provider";
// import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
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

interface UnifiedEditorProps {}

const UnifiedEditor: React.FC<UnifiedEditorProps> = ({}) => {
    // States
    const [currentFocusedEditor, setCurrentFocusedEditor] = useState<Editor | null>(null);
    const [windowWidths, setWindowWidths] = useState<Record<number, number>>({
        1: 600,
        2: 600,
    });

    // Contexts
    // - Editor
    const {
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
    } = useEditorContext();
    // - Editor Sidebar
    const { isEditorSidebarOpen, directoryItems, setDirectoryItems } = useEditorSidebarState();

    // const isMainAuthor = projectData.data[0]?.users
    //     ?.map((user) => user.id)
    //     .includes(currentUserId || "");

    // ** Save current user opened projects, works, submission **
    // Updating user settings with current state once every n seconds
    // const updateUserEditorSettings = useUpdateGeneralData();
    // const supabase = useSupabaseClient();

    // const handleUpdateEditorSettings = async () => {

    //     if (
    //         !!editorSettingsData.data[0] &&
    //         (!deepEqual(editorSettingsData.data[0]?.editorSettings?.openedProject, openedProject) ||
    //         !deepEqual(editorSettingsData.data[0]?.editorSettings?.openedWorkIdentifiers, openedWorkIdentifiers) ||
    //         !deepEqual(editorSettingsData.data[0]?.editorSettings?.openedProjectSubmission?.id, selectedSubmission?.id))
    //     ) {
    //         console.log("TRIGGERED");
    //         try {
    //             const databaseSettingsData = {
    //                 ...editorSettingsData.data[0]?.editorSettings,
    //                 openedProject: openedProject,
    //                 openedWorkIdentifiers: openedWorkIdentifiers,
    //             };

    //             const updatedData = await updateUserEditorSettings.mutateAsync({
    //                 supabase: supabase,
    //                 tableName: "user_settings",
    //                 identifierField: "user_id",
    //                 identifier: currentUserId || "",
    //                 updateFields: {
    //                     editor_settings: databaseSettingsData,
    //                 },
    //             });
    //         } catch (error) {
    //             console.log("An error ocurred: ", error);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         handleUpdateEditorSettings();
    //     }, 300000);

    //     return () => clearInterval(intervalId);
    // }, [editorSettingsData]);

    return (
        <div className="w-full flex flex-row">
            <EditorDataManager />
            <EditorSidebar />
            <div
                className={`flex flex-col w-full ${
                    isEditorSidebarOpen ? "ml-64" : "ml-12"
                } overflow-y-auto`}
            >
                <VersionControlPanel />
                {currentFocusedEditor && <Palette editor={currentFocusedEditor} />}
                <div className="flex flex-row w-full overflow-x-hidden">
                    {activeWindows &&
                        activeWindows.length > 0 &&
                        activeWindows.map((window, index) => (
                            // window
                            <div
                                key={index}
                                className="relative flex flex-col border-r-2 border-gray-500 shadow-sm"
                                style={{ width: `${windowWidths[window]}px` }}
                            >
                                {/* Cards */}
                                <WorkCards window={window} />

                                {/* Editors */}
                                <div className="flex bg-gray-300 items-center justify-center">
                                    {!!openedWorks && !!openedWorks[window] && (
                                        <WorkEditor
                                            keyProp={
                                                openedWorks[window][
                                                    currentWork[window]
                                                ]?.id.toString() || "0"
                                            }
                                            work={openedWorks[window][currentWork[window]]}
                                            onFocus={(editor: Editor | null) => {
                                                setCurrentFocusedEditor(editor);
                                                setCurrentWindow(window);
                                            }}
                                            extensions={extensions}
                                            editorProps={{
                                                attributes: {
                                                    class: `z-10 h-[842px] focus:outline-none bg-white border border-gray-300 shadow-sm`,
                                                },
                                            }}
                                            editorWidth={windowWidths[window] / 1.5}
                                        />
                                    )}
                                </div>
                                {/* {index < activeWindows.length - 1 && (
                                    <div
                                        className="cursor-ew-resize absolute right-0 top-0"
                                        style={{
                                            width: "4px",
                                            height: "100%",
                                            backgroundColor: "red",
                                        }}
                                        onMouseDown={(e) => handleMouseDown(window, e)}
                                    />
                                )} */}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default UnifiedEditor;

const transformOpenedWorksToIdentifiers = (
    openedWorks: Record<number, Record<number, Work>>
): Record<number, Record<number, WorkIdentifier>> => {
    return Object.keys(openedWorks).reduce((acc, windowKey) => {
        const windowWorks = openedWorks[Number(windowKey)];
        acc[Number(windowKey)] = Object.keys(windowWorks).reduce((innerAcc, workKey) => {
            const work = windowWorks[Number(workKey)];
            innerAcc[Number(workKey)] = {
                workId: work.id.toString(),
                workType: work.workType || "",
            };
            return innerAcc;
        }, {} as Record<number, WorkIdentifier>);
        return acc;
    }, {} as Record<number, Record<number, WorkIdentifier>>);
};

// TO be implemented:

// ** Logic for changing windows' widths **

// type ResizingState = {
//     window: number | null;
//     startX: number;
//     startWidth: number;
// };

// const [resizing, setResizing] = useState<ResizingState>({
//     window: null,
//     startX: 0,
//     startWidth: 0,
// });
// const unifiedEditorRef = useRef<HTMLDivElement>(null);

// const initializeWidths = () => {
//     const containerWidth = (unifiedEditorRef.current?.clientWidth ?? 0) - 300;
//     const initialWidth = containerWidth / activeWindows.length;
//     setWindowWidths({
//         1: initialWidth,
//         2: initialWidth,
//     });
// };

// useEffect(() => {
//     initializeWidths();

//     const handleResize = () => {
//         initializeWidths();
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//         window.removeEventListener("resize", handleResize);
//     };
// }, []);

// useEffect(() => {
//     const handleMouseMove = (event: MouseEvent) => {
//         if (resizing.window !== null) {
//             const delta = event.clientX - resizing.startX;
//             setWindowWidths((prevWidths) => {
//                 const newWidth = Math.max(resizing.startWidth + delta, 50);
//                 const otherWindowIndex = resizing.window === 1 ? 2 : 1;

//                 const totalWidth = unifiedEditorRef.current?.clientWidth ?? 0;
//                 const availableWidth = totalWidth - newWidth;

//                 return {
//                     ...prevWidths,
//                     [resizing.window || 0]: newWidth,
//                     [otherWindowIndex]: Math.max(availableWidth, 50),
//                 };
//             });
//         }
//     };

//     const handleMouseUp = () => {
//         setResizing({ window: null, startX: 0, startWidth: 0 });
//     };

//     if (resizing.window !== null) {
//         document.addEventListener("mousemove", handleMouseMove);
//         document.addEventListener("mouseup", handleMouseUp);
//         return () => {
//             document.removeEventListener("mousemove", handleMouseMove);
//             document.removeEventListener("mouseup", handleMouseUp);
//         };
//     }
// }, [resizing, activeWindows]);

// const handleMouseDown = (windowIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
//     setResizing({
//         window: windowIndex,
//         startX: event.clientX,
//         startWidth: windowWidths[windowIndex],
//     });
// };

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
