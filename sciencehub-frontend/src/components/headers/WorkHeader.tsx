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
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import dynamic from "next/dynamic";
import { formatDate } from "@/src/utils/functions";
import { usePathname, useRouter } from "next/navigation";
import MetricsPanel from "../complex-elements/MetricsPanel";
import ActionsButton from "../elements/ActionsButton";
import AddToProjectButton from "../elements/AddToProjectButton";
import { useCreateGeneralData } from "@/src/hooks/create/useCreateGeneralData";
import VisibilityTag from "../elements/VisibilityTag";
import { useUserActionsContext } from "@/src/contexts/current-user/UserActionsContext";
import { useDeleteGeneralData } from "@/src/hooks/delete/useDeleteGeneralData";
import { useUserSmallDataContext } from "@/src/contexts/current-user/UserSmallData";
import { Work } from "@/src/types/workTypes";
import { workTypeIconMap } from "../cards/small-cards/SmallWorkCard";
import UsersAndTeamsSmallUI from "../elements/UsersAndTeamsSmallUI";
import AddToWorkButton from "../elements/AddToWorkButton";
import CreatedAtUpdatedAt from "../elements/CreatedAtUpdatedAt";
const Skeleton = dynamic(() => import("@/src/components/ui/skeleton").then((mod) => mod.Skeleton));
const WorkEditModeUI = dynamic(() => import("@/src/modules/version-control-system/components/WorkEditModeUI"));

interface WorkHeaderProps {
    work?: Work;
    isLoading?: boolean;
    isEditModeOn: boolean;
    setIsEditModeOn: (isEditModeOn: boolean) => void;
}

/**
 * Header for the Work pages. Used in PaperCard, ExperimentCard etc.
 * Responsible for displaying main info (title users etc), metrics, handling user actions, toggling edit mode.
 */
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

    // TODO: Handle work actions
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

    return (
        <div
            style={{ backgroundColor: "var(--page-header-bg-color)" }}
            className="border border-gray-200 shadow-sm rounded-b-sm"
        >
            {/* First part */}
            <div className="flex justify-between flex-wrap md:flex-nowrap items-start px-4 md:px-10 pt-4 pb-8">
                {/* Left side: Title, Authors, Contributors, Created At */}
                <div className="min-w-[320px] w-[320px] md:w-auto mr-4">
                    <div
                        className="flex items-start font-semibold my-4"
                        style={{ fontSize: "24px" }}
                    >
                        <FontAwesomeIcon
                            icon={workTypeIconMap(work?.workType || "")?.icon || faQuestion}
                            className="text-gray-800 pr-2 pl-1 pt-1.5"
                            style={{
                                width: "15px",
                                color:
                                    workTypeIconMap(work?.workType || "")?.color || "rgb(31 41 55)",
                            }}
                        />
                        {!isLoading ? (
                            <>{work?.title || ""}</>
                        ) : (
                            <Skeleton className="w-40 h-8 bg-gray-400 ml-2" />
                        )}
                    </div>

                    <UsersAndTeamsSmallUI
                        label="Main Authors: "
                        users={work?.users || []}
                        teams={work?.teams || []}
                        isLoading={isLoading}
                        className="lg:text-lg"
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
                    <CreatedAtUpdatedAt createdAt={work?.createdAt} updatedAt={work?.updatedAt} />
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
                                value: (work?.views || [])[0]?.count?.toString(),
                                icon: faEye,
                            },
                            {
                                label: "Upvotes",
                                value: (work?.upvotes || [])[0]?.count?.toString(),
                                icon: faUpLong,
                            },
                            {
                                label: "Shares",
                                value: (work?.shares || [])[0]?.count?.toString(),
                                icon: faShare,
                            },
                        ]}
                        isLoading={isLoading}
                    />
                    <div className="flex items-center space-x-3 mt-4 justify-end">
                        {/* Actions Button */}
                        <ActionsButton actions={[]} />
                        <button
                            className="edit-button hover:bg-black"
                            onClick={() => setIsEditModeOn(!isEditModeOn)}
                        >
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="small-icon text-white mr-0 lg:mr-1"
                            />
                            <div className="hidden lg:block">Edit Mode</div>
                        </button>

                        <AddToWorkButton
                            addOptions={[
                                { label: "Add Submission" },
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
