"use client";

import {
    faBookJournalWhills,
    faBookmark,
    faBoxArchive,
    faEdit,
    faEye,
    faPaperclip,
    faQuoteRight,
    faShare,
    faTableList,
    faUpLong,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProjectPageNavigationMenuItems } from "@/config/navItems.config";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { ProjectDirectory, ProjectLayout } from "@/types/projectTypes";
import { useVersionControlLogic } from "@/version-control-system/hooks/useVersionControlLogic";
import { mergeProjectDeltaIntoProjectData } from "@/version-control-system/mergeProjectDeltaIntoProjectData";
import { TextDiff } from "@/types/versionControlTypes";
import dynamic from "next/dynamic";
import { formatDate } from "@/utils/functions";
import { useEditorContext } from "@/contexts/general/EditorContext";
import { usePathname, useRouter } from "next/navigation";
import { transformProjectLayoutToProjectDirectory } from "@/transforms-to-ui-types/transformProjectLayoutToProjectDirectory";
import MetricsPanel from "../complex-elements/MetricsPanel";
import ActionsButton from "../elements/ActionsButton";
import { useProjectDataContext } from "@/contexts/project/ProjectDataContext";
import { useProjectIdByName } from "@/hooks/utils/useProjectIdByName";
import AddToProjectButton from "../elements/AddToProjectButton";
import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import VisibilityTag from "../elements/VisibilityTag";
import { useUserActionsContext } from "@/contexts/current-user/UserActionsContext";
import { useDeleteGeneralData } from "@/hooks/delete/useDeleteGeneralData";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import UsersAndTeamsSmallUI from "../elements/UsersAndTeamsSmallUI";
import { useProjectEditModeContext } from "@/version-control-system/contexts/ProjectEditModeContext";
import ProjectEditModeUI from "@/version-control-system/components/ProjectEditModeUI";
const Skeleton = dynamic(() => import("@/components/ui/skeleton").then((mod) => mod.Skeleton));
const EditModeUI = dynamic(() => import("@/components/complex-elements/EditModeUI"));

interface ProjectHeaderProps {
    initialProjectLayout?: ProjectLayout;
    projectName?: string;
    initialIsLoading?: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    initialProjectLayout,
    projectName,
    initialIsLoading,
}) => {
    // States
    const [renderHeader, setRenderHeader] = useState<boolean>(true);

    // Contexts
    const router = useRouter();
    const pathname = usePathname();
    const splittedPath = pathname.split("/");
    const isAtRoot = splittedPath.length <= 5;

    const currentUserId = useUserId();
    const { userSmall, setUserSmall } = useUserSmallDataContext();
    const { userActions, setUserActions } = useUserActionsContext();

    const { projectLayout, setProjectLayout, isLoading, setIsLoading, currentTab, setCurrentTab } =
        useProjectDataContext();

    
    const {
        isEditModeOn,
        setIsEditModeOn,
        setProjectId,
        selectedProjectSubmission,
        selectedProjectSubmissionRefetch,
        projectDeltaChanges,
        setProjectDeltaChanges,
    } = useProjectEditModeContext();

    // const projectUsersIds = (projectLayout?.users || []).map((user) => user.id);
    // const isMainAuthor = projectUsersIds.includes(userId || "");

    // Custom hooks
    // - Get project data with hook
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: projectName || "",
    });
    const isProjectIdAvailable = projectId != null && !isNaN(Number(projectId));

    // const projectData = useProjectData(
    //     projectId || 0,
    //     isProjectIdAvailable && isAtRoot
    // );

    // Effects
    // - Save project data in context for all root pages
    useEffect(() => {
        if (initialProjectLayout) {
            setProjectLayout(initialProjectLayout);
        }
        if (!!initialIsLoading) {
            setIsLoading(!!initialIsLoading);
        }
    }, []);

    // - Sync nav menu with pathname change
    useEffect(() => {
        if (renderHeader) {
            setRenderHeader(false);
        }
        if (isAtRoot) {
            setRenderHeader(true);
            if (splittedPath[4]) {
                setCurrentTab(splittedPath[4].charAt(0).toUpperCase() + splittedPath[4].slice(1));
            } else {
                setCurrentTab("Overview");
            }
        }
    }, [pathname]);

    // const {
    //     isEditModeOn,
    //     toggleEditMode,
    //     selectedSubmission,
    //     submissionsData,
    //     handleChange,
    //     versionInfo,
    //     handleSave,
    //     projectDelta,
    // } = useVersionControlLogic(currentUserId || "", projectLayout?.id || 0);

    // - Editor
    const { setOpenedProject, setProjectDirectory } = useEditorContext();

    // Handles
    const handleOpenInEditor = () => {
        if (projectLayout) {
            setOpenedProject({
                id: projectLayout.id,
                title: projectLayout.title || "",
                name: projectLayout.name || "",
            });
            setRenderHeader(false);
            router.push("/workspace/tools/editor");
        }
    };

    // Handle project actions
    // Actions button
    const isProjectUpvoted = (userActions.data[0]?.projectUpvotes || [])
        .map((upvote) => upvote.projectId)
        .includes(projectId || 0);

    const projectBookmark = (userActions.data[0]?.bookmarks || []).filter(
        (bookmark) => bookmark.objectType === "Project" && bookmark.objectId === projectId
    );

    const isProjectBookmarked = projectBookmark.length > 0;

    const projectActions = [
        { label: "Cite", icon: faQuoteRight, onClick: () => {} },
        {
            label: "Upvote",
            icon: faUpLong,
            onClick: () => upvoteProject(projectId || 0),
            activated: isProjectUpvoted,
            activatedString: "Upvoted",
        },
        { label: "Share", icon: faShare, onClick: () => {} },
        {
            label: "Bookmark",
            icon: faBookmark,
            onClick: () => bookmarkProject(projectId || 0),
            activated: isProjectBookmarked,
            activatedString: "Bookmarked",
        },
    ];

    // - Upvoting
    const createObject = useCreateGeneralData();
    const deleteObject = useDeleteGeneralData();

    const upvoteProject = async (projectId: number) => {
        if (currentUserId && !!projectId && projectId !== 0) {
            if (!isProjectUpvoted) {
                const database_upvote = {
                    project_id: projectId,
                    upvoting_user_id: currentUserId,
                };

                const createdUpvote = await createObject.mutateAsync({
                    tableName: "project_upvotes",
                    input: database_upvote,
                });
            } else {
                const deletedUpvote = await deleteObject.mutateAsync({
                    tableName: "project_upvotes",
                    id: currentUserId,
                    idLabel: "upvoting_user_id",
                });
            }
            userActions.refetch?.();
        }
    };

    // - Bookmarking
    const bookmarkProject = async (projectId: number) => {
        if (currentUserId && !!projectId && projectId !== 0) {
            if (!isProjectBookmarked) {
                const database_bookmark = {
                    user_id: currentUserId,
                    object_type: "Project",
                    object_id: projectId,
                    bookmark_data: {
                        id: projectId,
                        title: projectLayout.title,
                        users: [
                            {
                                id: currentUserId,
                                username: userSmall.data[0].username,
                                full_name: userSmall.data[0].fullName,
                            },
                        ],
                    },
                };
                console.log(database_bookmark);

                const bookmark = await createObject.mutateAsync({
                    tableName: "bookmarks",
                    input: database_bookmark,
                });
            } else {
                const deletedObject = await deleteObject.mutateAsync({
                    tableName: "bookmarks",
                    id: projectBookmark[0].id,
                });
            }
            userActions.refetch?.();
        }
    };

    // Bookmarking

    if (!renderHeader) {
        return null;
    }

    return (
        <div style={{ backgroundColor: "var(--page-header-bg-color)" }}>
            {/* First part */}
            <div className="flex justify-between flex-wrap md:flex-nowrap items-start px-4 md:px-10 pt-4 pb-8">
                {/* Left side: Title, Authors, Contributors, Created At */}
                <div className="min-w-[320px] w-[320px] md:w-auto mr-4">
                    <div className="flex items-center">
                        <div
                            className="flex items-center font-semibold mb-4 mt-4 ml-6"
                            style={{ fontSize: "27px" }}
                        >
                            <FontAwesomeIcon
                                icon={faBoxArchive}
                                className="text-gray-800 pr-2"
                                style={{ width: "17px" }}
                            />
                            {!isLoading ? (
                                <>{projectLayout?.title || ""}</>
                            ) : (
                                <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                            )}
                        </div>

                        <VisibilityTag isPublic={projectLayout?.public} />
                    </div>
                    <UsersAndTeamsSmallUI
                        label="Main Authors: "
                        users={projectLayout.users || []}
                        teams={projectLayout.teams || []}
                        isLoading={isLoading}
                    />

                    <div className="flex mt-3 font-semibold text-gray-800">
                        <FontAwesomeIcon
                            className="small-icon"
                            icon={faUser}
                            style={{
                                marginLeft: "0.27em",
                                marginRight: "0.25em",
                                marginTop: "0.20em",
                            }}
                            color="#444444"
                        />
                        {"Contributors:"}
                        <div className="ml-1 text-blue-600 font-normal">
                            {"Gabriel Majeri, David Petcu"}
                        </div>
                    </div>
                    <div className="flex whitespace-nowrap pt-4 pl-1 text-gray-800 font-semibold">
                        {projectLayout?.createdAt && (
                            <div className="flex items-center mr-2">
                                Created at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(projectLayout?.createdAt || "")}
                                </div>
                            </div>
                        )}
                        {projectLayout?.updatedAt && (
                            <div className="flex items-center">
                                Updated at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(projectLayout?.updatedAt || "")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right-side: Metrics, Buttons */}
                <div className="">
                    <MetricsPanel
                        researchMetrics={[
                            {
                                label: "Research Score",
                                value: projectLayout?.researchScore?.toString(),
                                icon: faBookJournalWhills,
                            },
                            {
                                label: "h-Index",
                                value: projectLayout?.hIndex?.toString(),
                                icon: faTableList,
                            },
                            {
                                label: "Total Citations",
                                value: projectLayout?.totalCitationsCount?.toString(),
                                icon: faPaperclip,
                            },
                        ]}
                        communityMetrics={[
                            {
                                label: "Views",
                                value: (projectLayout?.projectViews || [])[0]?.count?.toString(),
                                icon: faEye,
                            },
                            {
                                label: "Upvotes",
                                value: (projectLayout?.projectUpvotes || [])[0]?.count?.toString(),
                                icon: faUpLong,
                            },
                            {
                                label: "Shares",
                                value: (projectLayout?.projectShares || [])[0]?.count?.toString(),
                                icon: faShare,
                            },
                        ]}
                        isLoading={isLoading}
                    />
                    <div className="flex items-center space-x-3 mt-4 justify-end">
                        {/* Actions Button */}
                        <ActionsButton actions={projectActions} />
                        {/* <Button className="edit-button hover:bg-black" onClick={handleOpenInEditor}>
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="small-icon text-white mr-0 lg:mr-1"
                            />
                            <div className="hidden lg:block">Open in Editor</div>
                        </Button> */}
                        <Button
                            className="edit-button hover:bg-black"
                            onClick={() => setIsEditModeOn(!isEditModeOn)}
                        >
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="small-icon text-white mr-0 lg:mr-1"
                            />
                            <div className="hidden lg:block">Edit Mode</div>
                        </Button>

                        <AddToProjectButton
                            addOptions={[
                                { label: "Add Work" },
                                { label: "Add Issue" },
                                { label: "Add Review" },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Menu and Buttons */}
            {/* <div
                className="flex justify-between items-center pr-10 pl-2 bg-gray-50 border-b border-gray-200 shadow-sm"
                style={{ backgroundColor: "var(--project-header-bg-color)" }}
            > */}
            <NavigationMenu
                items={getProjectPageNavigationMenuItems(
                    splittedPath[1],
                    projectLayout?.name || ""
                )}
                activeTab={currentTab}
                setActiveTab={setCurrentTab}
                className="space-x-6 pt-1 border-b border-gray-300 shadow-sm"
                pagesMode={true}
            />
            {/* </div> */}

            {/* To be moved */}
            {isEditModeOn && <ProjectEditModeUI />}

        </div>
    );
};

export default ProjectHeader;

// Rust microservice connection:

// async function fetchProjectVersionData(
//     projectId: number,
//     versionId: number
// ) {
//     try {
//         const response = await fetch(
//             "http://localhost:8080/get_project_version_data",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     project_id: projectId,
//                     project_version_id: versionId,
//                 }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data); // Process your data here
//     } catch (error) {
//         console.error("Failed to fetch project version data:", error);
//     }
// }

//     <button
//     className="w-20 h-20 bg-blue-600"
//     onClick={() =>
//         fetchProjectVersionData(
//             projectId || 1,
//             1
//         )
//     }
// >
//     Find Project Version
// </button>
