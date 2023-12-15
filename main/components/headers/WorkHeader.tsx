"use client";

import {
    faBookJournalWhills,
    faBookmark,
    faBoxArchive,
    faEdit,
    faEye,
    faPaperclip,
    faQuestion,
    faShare,
    faTableList,
    faUpLong,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import dynamic from "next/dynamic";
import { formatDate } from "@/utils/functions";
import { usePathname, useRouter } from "next/navigation";
import MetricsPanel from "../complex-elements/MetricsPanel";
import ActionsButton from "../elements/ActionsButton";
import AddToProjectButton from "../elements/AddToProjectButton";
import { useCreateGeneralData } from "@/app/hooks/create/useCreateGeneralData";
import VisibilityTag from "../elements/VisibilityTag";
import { useUserActionsContext } from "@/app/contexts/current-user/UserActionsContext";
import { useDeleteGeneralData } from "@/app/hooks/delete/useDeleteGeneralData";
import { useUserSmallDataContext } from "@/app/contexts/current-user/UserSmallData";
import { Work } from "@/types/workTypes";
import { workTypeIconMap } from "../elements/SmallWorkCard";
import EditModeUI from "../complex-elements/EditModeUI";
import WorkEditModeUI from "../complex-elements/WorkEditModeUI";

const Skeleton = dynamic(() =>
    import("@/components/ui/skeleton").then((mod) => mod.Skeleton)
);

interface WorkHeaderProps {
    work?: Work;
    isLoading?: boolean;
    isEditModeOn?: boolean;
    setIsEditModeOn?: (isEditModeOn: boolean) => void;
}

const WorkHeader: React.FC<WorkHeaderProps> = ({
    work,
    isLoading,
    isEditModeOn,
    setIsEditModeOn,
}) => {
    // Contexts
    const router = useRouter();
    const pathname = usePathname();
    const splittedPath = pathname.split("/");
    const isAtRoot = splittedPath.length <= 5;

    const currentUserId = useUserId();
    const { userSmall, setUserSmall } = useUserSmallDataContext();
    const { userActions, setUserActions } = useUserActionsContext();

    // const {
    //     isEditModeOn,
    //     toggleEditMode,
    //     selectedSubmission,
    //     submissionsData,
    //     handleChange,
    //     versionInfo,
    //     handleSave,
    //     projectDelta,
    // } = useVersionControlLogic(currentUserId || "", work?.id || 0);

    // // Handles
    // const handleOpenInEditor = () => {
    //     if (work) {
    //         setOpenedProject({
    //             id: work.id,
    //             title: work.title || "",
    //             name: work.name || "",
    //         });
    //         setRenderHeader(false);
    //         router.push("/workspace/tools/editor");
    //     }
    // };

    // Handle project actions
    // Actions button
    // const isProjectUpvoted = (userActions.data[0]?.projectUpvotes || [])
    //     .map((upvote) => upvote.projectId)
    //     .includes(projectId || 0);

    // const projectBookmark = (userActions.data[0]?.bookmarks || []).filter(
    //     (bookmark) =>
    //         bookmark.objectType === "Project" && bookmark.objectId === projectId
    // );

    // const isProjectBookmarked = projectBookmark.length > 0;

    // const projectActions = [
    //     { label: "Cite", icon: faQuoteRight, onClick: () => {} },
    //     {
    //         label: "Upvote",
    //         icon: faUpLong,
    //         onClick: () => upvoteProject(projectId || 0),
    //         activated: isProjectUpvoted,
    //         activatedString: "Upvoted",
    //     },
    //     { label: "Share", icon: faShare, onClick: () => {} },
    //     {
    //         label: "Bookmark",
    //         icon: faBookmark,
    //         onClick: () => bookmarkProject(projectId || 0),
    //         activated: isProjectBookmarked,
    //         activatedString: "Bookmarked",
    //     },
    // ];
    
    // // - Upvoting
    // const createObject = useCreateGeneralData();
    // const deleteObject = useDeleteGeneralData();

    // const upvoteProject = async (projectId: number) => {
    //     if (currentUserId && !!projectId && projectId !== 0) {
    //         if (!isProjectUpvoted) {
    //             const database_upvote = {
    //                 project_id: projectId,
    //                 upvoting_user_id: currentUserId,
    //             };

    //             const createdUpvote = await createObject.mutateAsync({
    //                 supabase,
    //                 tableName: "project_upvotes",
    //                 input: database_upvote,
    //             });
    //         } else {
    //             const deletedUpvote = await deleteObject.mutateAsync({
    //                 supabase,
    //                 tableName: "project_upvotes",
    //                 id: currentUserId,
    //                 idLabel: "upvoting_user_id",
    //             });
    //         }
    //         userActions.refetch?.();
    //     }
    // };

    // // - Bookmarking
    // const bookmarkProject = async (projectId: number) => {
    //     if (currentUserId && !!projectId && projectId !== 0) {
    //         if (!isProjectBookmarked) {
    //             const database_bookmark = {
    //                 user_id: currentUserId,
    //                 object_type: "Project",
    //                 object_id: projectId,
    //                 bookmark_data: {
    //                     id: projectId,
    //                     title: work.title,
    //                     users: [
    //                         {
    //                             id: currentUserId,
    //                             username: userSmall.data[0].username,
    //                             full_name: userSmall.data[0].fullName,
    //                         },
    //                     ],
    //                 },
    //             };
    //             console.log(database_bookmark);

    //             const bookmark = await createObject.mutateAsync({
    //                 supabase,
    //                 tableName: "bookmarks",
    //                 input: database_bookmark,
    //             });
    //         } else {
    //             const deletedObject = await deleteObject.mutateAsync({
    //                 supabase,
    //                 tableName: "bookmarks",
    //                 id: projectBookmark[0].id,
    //             });
    //         }
    //         userActions.refetch?.();
    //     }
    // };

    // Bookmarking

    return (
        <div style={{ backgroundColor: "var(--page-header-bg-color)" }} className="border border-gray-200 shadow-sm rounded-b-sm">
            {/* First part */}
            <div className="flex justify-between flex-wrap md:flex-nowrap items-start px-4 md:px-10 pt-4 pb-8">
                {/* Left side: Title, Authors, Contributors, Created At */}
                <div className="min-w-[320px] w-[320px] md:w-auto mr-4">
                    <div className="flex items-center">
                        <div
                            className="flex items-center font-semibold mb-4 mt-4 ml-6"
                            style={{ fontSize: "24px" }}
                        >
                            <FontAwesomeIcon
                                icon={workTypeIconMap(work?.workType || "")?.icon || faQuestion}
                                className="text-gray-800 pr-2"
                                style={{ width: "17px", color: workTypeIconMap(work?.workType || "")?.color || "rgb(31 41 55)" }}
                            />
                            {!isLoading ? (
                                <>{work?.title || ""}</>
                            ) : (
                                <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                            )}
                        </div>

                        <VisibilityTag isPublic={work?.public} />
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
                                {(work?.users || []).map(
                                    (user, index) => (
                                        <Link
                                            key={index}
                                            href={`/${user.username}/profile`}
                                        >
                                            <span className="ml-1 text-blue-600 block">
                                                {index !==
                                                (work?.users || [])
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
                        {work?.createdAt && (
                            <div className="flex items-center mr-2">
                                Created at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(work?.createdAt || "")}
                                </div>
                            </div>
                        )}
                        {work?.updatedAt && (
                            <div className="flex items-center">
                                Updated at:
                                <div className="pl-1 font-normal text-gray-700">
                                    {formatDate(work?.updatedAt || "")}
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
                                value: work?.researchScore?.toString(),
                                icon: faBookJournalWhills,
                            },
                            {
                                label: "h-Index",
                                value: work?.hIndex?.toString(),
                                icon: faTableList,
                            },
                            {
                                label: "Total Citations",
                                value: work?.citationsCount?.toString(),
                                icon: faPaperclip,
                            },
                        ]}
                        communityMetrics={[
                            {
                                label: "Views",
                                value: (work?.views ||
                                    [])[0]?.count?.toString(),
                                icon: faEye,
                            },
                            {
                                label: "Upvotes",
                                value: (work?.upvotes ||
                                    [])[0]?.count?.toString(),
                                icon: faUpLong,
                            },
                            {
                                label: "Shares",
                                value: (work?.shares ||
                                    [])[0]?.count?.toString(),
                                icon: faShare,
                            },
                        ]}
                        isLoading={isLoading}
                    />
                    <div className="flex items-center space-x-3 mt-4 justify-end">
                        {/* Actions Button */}
                        <ActionsButton actions={[]} />
                        <Button
                            className="edit-button hover:bg-black"
                            onClick={() => setIsEditModeOn?.(!isEditModeOn)}
                        >
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="small-icon text-white mr-0 lg:mr-1"
                            />
                            <div className="hidden lg:block">
                                Edit Mode
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
            {isEditModeOn && <WorkEditModeUI />}
            

            {/* Navigation Menu and Buttons */}
            {/* <div
                className="flex justify-between items-center pr-10 pl-2 bg-gray-50 border-b border-gray-200 shadow-sm"
                style={{ backgroundColor: "var(--project-header-bg-color)" }}
            > */}
        </div>
    );
};

export default WorkHeader;
