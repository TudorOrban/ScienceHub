import { ProjectDirectory, ProjectSmall } from "@/types/projectTypes";
import { Work, WorkSmall } from "@/types/workTypes";
import { useContext, useEffect, useState } from "react";

import { useEditor } from "@tiptap/react";
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
import { useProjectSubmissionsSearch } from "../hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import { useExperimentsSearch } from "../hooks/fetch/search-hooks/works/useExperimentsSearch";
import { createUseUnifiedSearch } from "../hooks/fetch/search-hooks/useUnifiedSearch";

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
        class: "z-10 w-[595px] h-[842px] flex-none focus:outline-none bg-white border-x border-gray-200 shadow-sm",
    },
};

interface UnifiedEditorProps {}

const UnifiedEditor: React.FC<UnifiedEditorProps> = ({}) => {
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
        fetchEditorSettings,
        setFetchEditorSettings,
    } = useEditorContext();

    // - Editor Sidebar
    const editorSidebarState = useEditorSidebarState();
    const { isEditorSidebarOpen, directoryItems, setDirectoryItems } = editorSidebarState;

    // Tiptap Editor Hook
    const editor = useEditor({
        extensions,
        content: currentWork[currentWindow].description,
        editorProps,
    });
    // console.log("EDITOR HTML", editor?.getHTML());

    // Fetch editor settings and associated data (if necessary)
    const editorSettingsData = useEditorSettings(
        currentUserId || "",
        fetchEditorSettings && !!currentUserId
    );

    const userOpenedProject = editorSettingsData.data[0]?.editorSettings?.openedProject;
    const userOpenedWorks = editorSettingsData.data[0]?.editorSettings?.openedWorks;
    const userSelectedSubmission =
        editorSettingsData.data[0]?.editorSettings?.openedProjectSubmission;

    const projectData = useProjectData(
        userOpenedProject?.id || 0,
        fetchEditorSettings && !!editorSettingsData.data[0]?.editorSettings?.openedProject?.id
    );

    useEffect(() => {
        if (fetchEditorSettings && !!projectData.data[0]) {
            const projectDirectoryResult: ProjectDirectory =
                transformProjectLayoutToProjectDirectory(projectData.data[0]);
            setProjectDirectory(projectDirectoryResult);
        }
    }, [projectData.data[0], fetchEditorSettings]);

    // Use main service fetching if selected submission's initial version = current project version
    const useMainServiceFetch =
        userSelectedSubmission?.initialProjectVersionId === projectDirectory?.currentVersionId;

    // const projectExperimentIds = projectData.data[0]?.experiments?.map((exp) => exp.id);
    // const projectDatasetIds = projectData.data[0]?.datasets?.map((d) => d.id);
    // const projectDataAnalysisIds = projectData.data[0]?.dataAnalyses?.map((da) => da.id);
    // const projectAIModelIds = projectData.data[0]?.aiModels?.map((ai) => ai.id);
    // const projectCodeBlockIds = projectData.data[0]?.codeBlocks?.map((cb) => cb.id);
    // const projectPaperIds = projectData.data[0]?.papers?.map((p) => p.id);

    const openedExperiments = createUseUnifiedSearch({
        fetchGeneralDataParams: {
            tableName: "experiments",
            categories: [],
            options: {
                tableRowsIds:
                    Object.values(userOpenedWorks || {})
                        ?.filter((work) => work.workType === "Experiment")
                        .map((work) => (work.workId?.toString() || "0")) || [],
            },
        },
        reactQueryOptions: {
            enabled: useMainServiceFetch && !!userOpenedWorks,
        },
    })();

    console.log("DSADSADASD", openedExperiments);
    const isMainAuthor = projectData.data[0]?.users
        ?.map((user) => user.id)
        .includes(currentUserId || "");
    // const openedExperimentsData = useExperimentsSearch({

    // })

    const projectSubmissionsData = useProjectSubmissionsSearch({
        extraFilters: {
            project_id: userOpenedProject?.id,
        },
        enabled: fetchEditorSettings && !!userOpenedProject?.id,
        context: "Project General",
        page: 1,
        itemsPerPage: 100,
        includeRefetch: true,
    });

    // Version control
    const projectDeltaData = useProjectDelta("1", true);
    const projectDelta = projectDeltaData?.data[0];

    // Save logic
    const supabase = useSupabaseClient();
    const { mutateAsync: updateProjectDeltaMutation } = useUpdateGeneralData<ProjectDelta>();

    let reconstructedDescription: string = currentWork[currentWindow].description || "";

    const handleSaveFile = async () => {
        if (typeof currentWork[currentWindow].description === "string" && !!editor?.getHTML) {
            // Compute text diff from content HTML
            const textDiff = calculateDiffs(
                currentWork[currentWindow].description!,
                editor?.getHTML()
            );
            // console.log(
            //     "TEXT DIFF",
            //     currentWork[currentWindow].description,
            //     textDiff
            // );

            // Save
            const updateFieldsSnakeCase: Partial<ProjectDelta> = {
                delta_data: {
                    ...projectDelta.deltaData,
                    description: textDiff,
                },
                initial_project_version_id: projectDelta.initialProjectVersionId,
                final_project_version_id: projectDelta.finalProjectVersionId,
            } as unknown as Partial<ProjectDelta>;

            // Update the database
            await updateProjectDeltaMutation({
                supabase: supabase,
                tableName: "project_deltas",
                identifierField: "id",
                identifier: projectDelta.id,
                updateFields: updateFieldsSnakeCase,
            });

            // Reconstruct text for editor content
            reconstructedDescription = applyTextDiffs(
                currentWork[currentWindow].description || "",
                textDiff
            );
            console.log(
                "Reconstruction",
                reconstructedDescription,
                reconstructedDescription === editor.getHTML()
            );
        }
    };

    // useEffect(() => {
    //     if (editor) {
    //         editor.commands.setContent(
    //             currentWork[currentWindow].description +
    //                 "<hr>" +
    //                 reconstructedDescription
    //         );
    //     }
    // }, [editor?.getHTML()]);

    // Initialize displayed content
    useEffect(() => {
        if (editor) {
            editor.commands.setContent(reconstructedDescription);
        }
    }, [editor, currentWork, currentWindow]);

    useEffect(() => {
        if (projectDirectory && projectDirectory.items !== directoryItems) {
            setDirectoryItems(projectDirectory.items);
        }
    }, [projectDirectory]);

    return (
        <div className="w-full flex flex-row">
            <EditorSidebar />
            <div className={`w-full ${isEditorSidebarOpen ? "ml-64" : "ml-12"} overflow-y-auto`}>
                <VersionControlPanel
                    submissionsIds={[].map((submission: any) => submission.id) || []}
                    submissionInitialProjectVersion={""}
                    submissionFinalProjectVersion={""}
                    handleSave={handleSaveFile}
                />
                {editor && <Palette editor={editor} onSave={handleSaveFile} />}
                {activeWindows &&
                    activeWindows.length > 0 &&
                    activeWindows.map((window, index) => (
                        // window
                        <div key={index} className="">
                            {/* Cards */}
                            <div className="flex items-center bg-gray-50 space-x-0 border-b border-gray-200">
                                {openedWorks &&
                                    Object.keys(openedWorks).includes(window.toString()) &&
                                    openedWorks[window].map((work, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center min-w-20 p-2 border border-gray-200 rounded-t-md ${
                                                work.id === currentWork[window].id
                                                    ? "bg-gray-200"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <button
                                                onClick={() =>
                                                    setCurrentWork({
                                                        [window]: work,
                                                    })
                                                }
                                                className="flex items-center"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        workTypeIconMap(work.workType || "").icon ||
                                                        faQuestion
                                                    }
                                                    className="ml-2 mr-1"
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
                                                    // Filter out the work you want to close
                                                    const filteredWorks = openedWorks[
                                                        window
                                                    ].filter((item) => item.id !== work.id);

                                                    // Update the state with the filtered array
                                                    setOpenedWorks({
                                                        ...openedWorks,
                                                        [window]: filteredWorks,
                                                    });
                                                    if (currentWork[window].id === work.id) {
                                                        setCurrentWork({
                                                            [window]:
                                                                openedWorks[window][index - 1],
                                                        });
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
                                {editor &&
                                    openedWorks &&
                                    Object.keys(openedWorks).includes(window.toString()) &&
                                    openedWorks[window].map((work, index) => (
                                        <div key={index} className="flex justify-center">
                                            {work.id === currentWork[window].id ? (
                                                <EditorContent
                                                    key={currentWork[currentWindow].id}
                                                    editor={editor}
                                                    className=""
                                                    id={work.id.toString() || "0"}
                                                />
                                            ) : null}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default UnifiedEditor;
