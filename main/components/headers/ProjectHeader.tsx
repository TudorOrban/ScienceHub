"use client";

import {
    faBookJournalWhills,
    faBookmark,
    faBoxArchive,
    faEdit,
    faEye,
    faGlobe,
    faLock,
    faPaperclip,
    faPlus,
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
import { useUserId } from "@/app/contexts/general/UserIdContext";
import { ProjectDirectory, ProjectLayout } from "@/types/projectTypes";
import { useVersionControlLogic } from "@/app/version-control-system/hooks/useVersionControlLogic";
import { mergeProjectDeltaIntoProjectData } from "@/app/version-control-system/mergeProjectDeltaIntoProjectData";
import { TextDiff } from "@/types/versionControlTypes";
import dynamic from "next/dynamic";
import { formatDate } from "@/utils/functions";
import { useEditorContext } from "@/app/contexts/general/EditorContext";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarState } from "@/app/contexts/sidebar-contexts/SidebarContext";
import { transformProjectLayoutToProjectDirectory } from "@/utils/transformProjectLayoutToProjectDirectory";
import MetricsPanel from "../complex-elements/MetricsPanel";
import ActionsButton from "../elements/ActionsButton";
import { useProjectDataContext } from "@/app/contexts/project/ProjectDataContext";
import { useProjectIdByName } from "@/app/hooks/utils/useProjectIdByName";
import useProjectData from "@/app/hooks/fetch/data-hooks/projects/useProjectDataTest";
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
    // const [activeTab, setActiveTab] = useState<string>("Overview");
    const [renderHeader, setRenderHeader] = useState<boolean>(true);

    // Contexts
    const router = useRouter();
    const pathname = usePathname();
    const splittedPath = pathname.split("/");
    const isAtRoot = splittedPath.length <= 5;

    const currentUserId = useUserId();

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

    const projectData = useProjectData(
        projectId || 0,
        isProjectIdAvailable && isAtRoot
    );

    // Effects
    // - Save project data in context for all root pages
    useEffect(() => {
        if (initialProjectLayout || projectData.data) {
            setProjectLayout(initialProjectLayout || projectData.data[0]);
        }
        if (!!initialIsLoading || !!projectData.isLoading) {
            setIsLoading(!!initialIsLoading || !!projectData.isLoading);
        }
    }, [projectData]);

    // - Sync nav menu with pathname change
    useEffect(() => {
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
        } else {
            setRenderHeader(false);
        }
    }, [pathname]);

    const {
        isEditModeOn,
        toggleEditMode,
        selectedSubmission,
        submissionsData,
        handleChange,
        versionInfo,
        handleSave,
        projectDelta,
    } = useVersionControlLogic(currentUserId || "", projectLayout?.id || 0);

    // const finalProjectData = existingProjectDelta?.deltaData
    //     ? mergeProjectDeltaIntoProjectData(
    //           projectData,
    //           existingProjectDelta.deltaData as unknown as Record<
    //               string,
    //               TextDiff[]
    //           >
    //       )
    //     : projectData;

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

            const projectDirectoryResult: ProjectDirectory =
                transformProjectLayoutToProjectDirectory(projectLayout);
            setProjectDirectory(projectDirectoryResult);
            router.push(pathname + `/tools/editor`);
        }
    };

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
                                style={{ width: "18px" }}
                            />
                            {!isLoading ? (
                                <>{projectLayout?.title || ""}</>
                            ) : (
                                <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                            )}
                        </div>

                        {projectLayout?.public && (
                            <div className="flex items-center ml-3 p-1 mt-1 bg-white border border-gray-200 rounded-md">
                                <FontAwesomeIcon
                                    icon={
                                        projectLayout?.public ? faGlobe : faLock
                                    }
                                    className={
                                        projectLayout?.public
                                            ? "text-green-700"
                                            : "text-gray-600"
                                    }
                                    style={{
                                        width: projectLayout?.public
                                            ? "12px"
                                            : "10px",
                                    }}
                                />
                                <div className="text-gray-700 text-sm pl-1">
                                    {projectLayout?.public
                                        ? "Public"
                                        : "Private"}
                                </div>
                            </div>
                        )}
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
                            <div className="flex mr-2">
                                Created at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(projectLayout?.createdAt || "")}
                                </div>
                            </div>
                        )}
                        {projectLayout?.updatedAt && (
                            <div className="flex">
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
                        <ActionsButton
                            actions={[
                                { label: "Cite", icon: faQuoteRight },
                                { label: "Upvote", icon: faUpLong },
                                { label: "Share", icon: faShare },
                                { label: "Bookmark", icon: faBookmark },
                            ]}
                        />
                        <Button
                            className="edit-button"
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
                        <Button
                            variant="default"
                            className="create-button"
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="small-icon mr-0 lg:mr-2"
                            />
                            <div className="hidden lg:block">
                                Add to project
                            </div>
                        </Button>
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
            {isEditModeOn && (
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
            )}
        </div>
    );
};

export default ProjectHeader;
