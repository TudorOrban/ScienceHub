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
import { getProjectPageNavigationMenuItems } from "@/utils/navItems.config";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { ProjectDirectory, ProjectLayout } from "@/types/projectTypes";
import { useVersionControlLogic } from "@/app/version-control-system/hooks/useVersionControlLogic";
import { mergeProjectDeltaIntoProjectData } from "@/app/version-control-system/mergeProjectDeltaIntoProjectData";
import { TextDiff } from "@/types/versionControlTypes";
import dynamic from "next/dynamic";
import { formatDate } from "@/utils/functions";
import { useEditorContext } from "@/app/contexts/general/EditorContext";
import { usePathname, useRouter } from "next/navigation";
import { transformProjectLayoutToProjectDirectory } from "@/utils/transformProjectLayoutToProjectDirectory";
import MetricsPanel from "../complex-elements/MetricsPanel";
import ActionsButton from "../elements/ActionsButton";
import { useProjectDataContext } from "@/app/contexts/project/ProjectDataContext";
import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import AddToProjectButton from "../elements/AddToProjectButton";
import { useCreateGeneralData } from "@/app/hooks/create/useCreateGeneralData";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import VisibilityTag from "../elements/VisibilityTag";
import { useUserActionsContext } from "@/app/contexts/current-user/UserActionsContext";
import { useDeleteGeneralData } from "@/app/hooks/delete/useDeleteGeneralData";
import { useUserSmallDataContext } from "@/app/contexts/current-user/UserSmallData";
const Skeleton = dynamic(() =>
    import("@/components/ui/skeleton").then((mod) => mod.Skeleton)
);
const EditModeUI = dynamic(
    () => import("@/components/complex-elements/EditModeUI")
);

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

    const supabase = useSupabaseClient();

    const currentUserId = useUserId();
    const { userSmall, setUserSmall } = useUserSmallDataContext();
    const { userActions, setUserActions } = useUserActionsContext();

    const {
        projectLayout,
        setProjectLayout,
        isLoading,
        setIsLoading,
        currentTab,
        setCurrentTab,
    } = useProjectDataContext();

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
                setCurrentTab(
                    splittedPath[4].charAt(0).toUpperCase() +
                        splittedPath[4].slice(1)
                );
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
            router.push(pathname + `/tools/editor`);
        }
    };

    // Handle project actions
    // Actions button
    const isProjectUpvoted = (userActions.data[0]?.projectUpvotes || [])
        .map((upvote) => upvote.projectId)
        .includes(projectId || 0);

    const projectBookmark = (userActions.data[0]?.bookmarks || []).filter(
        (bookmark) =>
            bookmark.objectType === "Project" && bookmark.objectId === projectId
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
                    supabase,
                    tableName: "project_upvotes",
                    input: database_upvote,
                });
            } else {
                const deletedUpvote = await deleteObject.mutateAsync({
                    supabase,
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
                    supabase,
                    tableName: "bookmarks",
                    input: database_bookmark,
                });
            } else {
                const deletedObject = await deleteObject.mutateAsync({
                    supabase,
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

                        <VisibilityTag isPublic={projectLayout.public} />
                    </div>
                    <div className="flex items-center text-gray-800 text-lg flex-wrap">
                        <FontAwesomeIcon
                            className="small-icon"
                            icon={faUser}
                            style={{
                                marginLeft: "0.2em",
                                marginRight: "0.25em",
                                marginBottom: "0.1em",
                            }}
                            color="#444444"
                        />
                        <span className="whitespace-nowrap block font-semibold">
                            Main Authors:
                        </span>
                        {!isLoading ? (
                            <>
                                {(projectLayout?.users || []).map(
                                    (user, index) => (
                                        <Link
                                            key={index}
                                            href={`/${user.username}/profile`}
                                        >
                                            <span className="ml-1 text-blue-600 block">
                                                {index !==
                                                (projectLayout?.users || [])
                                                    .length -
                                                    1
                                                    ? `${user.fullName}, `
                                                    : user.fullName}
                                            </span>
                                        </Link>
                                    )
                                )}
                            </>
                        ) : (
                            <Skeleton className="w-20 h-4 bg-gray-400 ml-2" />
                        )}
                    </div>

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
                                value: (projectLayout?.projectViews ||
                                    [])[0]?.count?.toString(),
                                icon: faEye,
                            },
                            {
                                label: "Upvotes",
                                value: (projectLayout?.projectUpvotes ||
                                    [])[0]?.count?.toString(),
                                icon: faUpLong,
                            },
                            {
                                label: "Shares",
                                value: (projectLayout?.projectShares ||
                                    [])[0]?.count?.toString(),
                                icon: faShare,
                            },
                        ]}
                        isLoading={isLoading}
                    />
                    <div className="flex items-center space-x-3 mt-4 justify-end">
                        {/* Actions Button */}
                        <ActionsButton actions={projectActions} />
                        <Button
                            className="edit-button hover:bg-black"
                            onClick={handleOpenInEditor}
                        >
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="small-icon text-white mr-0 lg:mr-1"
                            />
                            <div className="hidden lg:block">
                                Open in Editor
                            </div>
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
                    projectLayout.name || ""
                )}
                activeTab={currentTab}
                setActiveTab={setCurrentTab}
                className="space-x-6 pt-1 border-b border-gray-300 shadow-sm"
                pagesMode={true}
            />
            {/* </div> */}

            {/* To be moved */}
            {/* {isEditModeOn && (
                <EditModeUI
                    isEditModeOn={isEditModeOn}
                    toggleEditMode={toggleEditMode}
                    handleChange={handleChange}
                    selectedSubmission={selectedSubmission || 0}
                    submissionsIds={
                        submissionsData?.map(
                            (submission: any) => submission.id
                        ) || []
                    }
                    submissionInitialProjectVersion={
                        versionInfo?.initialProjectVersionId || ""
                    }
                    submissionFinalProjectVersion={
                        versionInfo?.finalProjectVersionId || ""
                    }
                    handleSave={handleSave}
                />
            )} */}
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
