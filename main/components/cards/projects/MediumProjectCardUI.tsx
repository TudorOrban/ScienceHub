import {
    faBookJournalWhills,
    faBoxArchive,
    faCaretDown,
    faCaretUp,
    faClipboardCheck,
    faEllipsis,
    faTableList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    getMetricsFeatures,
    getProjectCardWorksFeatures,
    getProjectCardManageFeatures,
} from "@/utils/navItems.config";
import {
    faPlus,
    faQuoteRight,
    faShare,
    faUpLong,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../ui/button";
import ActionButton from "../../elements/ActionButton";
import useIdentifier from "@/app/hooks/utils/useIdentifier";
import { MediumProjectCard } from "@/types/projectTypes";
import { useDeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import dynamic from "next/dynamic";
import FeatureBox from "@/components/elements/FeatureBox";
const ConfirmDialog = dynamic(
    () => import("@/components/elements/ConfirmDialog")
);
const Skeleton = dynamic(() =>
    import("@/components/ui/skeleton").then((mod) => mod.Skeleton)
);

interface ProjectCardProps {
    project: MediumProjectCard;
    onDeleteProject: (projectId: number) => void;
    viewMode: "expanded" | "collapsed";
    disableViewMode?: boolean;
    isLoading?: boolean;
    isError?: boolean;
}

const ProjectCardUI: React.FC<ProjectCardProps> = ({
    project,
    viewMode,
    disableViewMode,
    onDeleteProject,
    isLoading,
    isError,
}) => {
    // States
    const [localViewMode, setLocalViewMode] = useState<
        "expanded" | "collapsed"
    >(viewMode);

    useEffect(() => {
        setLocalViewMode(viewMode);
    }, [viewMode]);

    // Contexts
    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // Getting data ready for display
    const userIds = (project.users || []).map((user) => user.username);
    const teamIds = (project.teams || []).map((team) => `T~${team.teamName}`);
    const identifier = [...userIds, ...teamIds].join("~");

    const layoutFeatures = getProjectCardWorksFeatures(
        project.experimentsCount || 0,
        project.datasetsCount || 0,
        project.dataAnalysesCount || 0,
        project.aiModelsCount || 0,
        project.codeBlocksCount || 0,
        project.papersCount || 0,
        identifier || "",
        project.name || "Alphafold"
    );
    const manageFeatures = getProjectCardManageFeatures(
        project.projectSubmissionsCount || 0,
        project.projectIssuesCount || 0,
        project.projectReviewsCount || 0,
        identifier || "",
        project.name || "Alphafold"
    );

    return (
        <div
            className={`border border-gray-300 w-full shadow-md min-w-fit ${
                localViewMode === "expanded" ? "rounded-lg" : "rounded-lg"
            }`}
        >
            {/* Collapsed Content */}
            <div
                className={`flex justify-between items-start p-3 bg-gray-50 border-b border-gray-300 ${
                    localViewMode === "collapsed"
                        ? "rounded-lg"
                        : "rounded-t-lg"
                }`}
            >
                {/* Left side */}
                <div className="">
                    {/* Title and view mode */}
                    <div className="flex items-center mt-1">
                        <FontAwesomeIcon
                            icon={faBoxArchive}
                            className="text-gray-700"
                            style={{ width: "14px", marginTop: "1px" }}
                        />
                        {!isLoading && !!project ? (
                            <Link
                                href={`/${identifier}/projects/${project.name}`}
                                className="ml-2 hover:text-blue-600"
                                style={{
                                    fontSize: "19px",
                                    fontWeight: 500,
                                }}
                            >
                                {project.title}
                            </Link>
                        ) : (
                            <Skeleton className="w-20 h-4 bg-gray-400 ml-2" />
                        )}
                        {!disableViewMode && (
                            <button
                                onClick={(e) => {
                                    setLocalViewMode(
                                        localViewMode === "expanded"
                                            ? "collapsed"
                                            : "expanded"
                                    );
                                }}
                                className="text-black ml-2 mr-2 mt-1"
                            >
                                <FontAwesomeIcon
                                    icon={
                                        localViewMode === "expanded"
                                            ? faCaretUp
                                            : faCaretDown
                                    }
                                    style={{
                                        fontSize: "1.1em",
                                    }}
                                    className="text-gray-700"
                                />
                            </button>
                        )}
                        {isDeleteModeOn && (
                            <ConfirmDialog
                                objectId={project.id}
                                onDelete={() => onDeleteProject(project.id)}
                                objectType={"project"}
                            />
                        )}
                    </div>

                    {/* Authors & Contributors */}
                    <div className="flex items-center text-base flex-wrap mt-3 text-gray-600 ">
                        <FontAwesomeIcon
                            className="small-icon text-gray-700 mr-1"
                            icon={faUser}
                        />
                        <span className="whitespace-nowrap block">
                            Main Authors:
                        </span>
                        {!isLoading && !!project ? (
                            <>
                                {(project.users || []).map((user, index) => (
                                    <Link
                                        key={index}
                                        href={`/${user.username}/profile`}
                                    >
                                        <span className="ml-1 text-blue-600 hover:text-blue-700 block">
                                            {user.fullName}
                                            {index !==
                                            (project.users || []).length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    </Link>
                                ))}
                                {(project.teams || []).map((team, index) => (
                                    <Link
                                        key={index}
                                        href={`/${team.teamName}/profile`}
                                    >
                                        <span className="ml-1 text-blue-600 hover:text-blue-700 block">
                                            {index !==
                                            (project.teams || []).length
                                                ? ", "
                                                : ""}
                                            {team.teamName}
                                        </span>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <Skeleton className="w-20 h-4 bg-gray-400 ml-2 my-0 mr-0 p-0" />
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col">
                    <div className="flex justify-end mr-1">
                        {!!project ? (
                            <>
                                <div
                                    className="flex flex-wrap items-center px-2 md:space-x-2 bg-white border border-gray-300 shadow-sm rounded-md whitespace-nowrap text-base"
                                    style={{
                                        fontSize: "0.9rem",
                                        lineHeight: "1.35rem",
                                    }}
                                >
                                    <div className="flex items-center p-1.5">
                                        <FontAwesomeIcon
                                            icon={faBookJournalWhills}
                                            className="mr-1"
                                            style={{ width: "11px" }}
                                        />
                                        Research Score:{" "}
                                        <span className="font-semibold pl-1 text-gray-700">
                                            {project?.researchScore || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center p-1.5">
                                        <FontAwesomeIcon
                                            icon={faTableList}
                                            className="mr-2 text-gray-700"
                                            style={{ width: "13px" }}
                                        />
                                        h-Index:{" "}
                                        <span className="font-semibold pl-1">
                                            {project?.hIndex || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center p-1.5">
                                        <FontAwesomeIcon
                                            icon={faClipboardCheck}
                                            className="mr-1"
                                            style={{ width: "11px" }}
                                        />
                                        Citations:{" "}
                                        <span className="font-semibold pl-1 text-gray-700">
                                            {project?.totalCitationsCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Skeleton className="w-80 h-6 bg-gray-400 ml-2" />
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-3 mr-2">
                        <ActionButton
                            icon={faEllipsis}
                            tooltipText={"More Actions"}
                            className="w-8 h-8"
                        />
                        <ActionButton
                            icon={faUpLong}
                            tooltipText={"Upvote"}
                            className="w-8 h-8"
                        />
                        <ActionButton
                            icon={faQuoteRight}
                            tooltipText={"Cite"}
                            className="w-8 h-8"
                        />
                        <ActionButton
                            icon={faShare}
                            tooltipText={"Share"}
                            className="w-8 h-8"
                        />
                        <Button
                            variant="default"
                            className="bg-blue-600 text-white whitespace-nowrap lg:mt-0 flex-shrink-0 w-8 h-8 hover:bg-blue-700"
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="small-icon"
                            />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ... Expanded content */}
            {/* <AnimatePresence> */}
            {localViewMode === "expanded" && !!project && (
                // <motion.div
                // initial={{ height: 0, opacity: 0 }}
                // animate={{ height: "auto", opacity: 1 }}
                // exit={{ height: 0, opacity: 0 }}
                // transition={{ duration: 0.4 }}
                // className="border-t border-gray-300"
                // >
                <>
                    {/* Project Features */}
                    <div className="flex items-start justify-between m-2">
                        <div>
                            <div className="flex flex-wrap items-center">
                                {layoutFeatures
                                    .filter((feature, index) => index < 3)
                                    .map((feature, index) => (
                                        <div key={index}>
                                            <FeatureBox
                                                feature={{
                                                    label: feature.label,
                                                    icon: feature.icon,
                                                    iconColor:
                                                        feature.iconColor,
                                                    value: feature.value,
                                                    link: feature.link,
                                                }}
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="flex flex-wrap items-center">
                                {layoutFeatures.length >= 3 &&
                                    layoutFeatures
                                        .filter((feature, index) => index >= 3)
                                        .map((feature, index) => (
                                            <div key={index}>
                                                <FeatureBox
                                                    feature={{
                                                        label: feature.label,
                                                        icon: feature.icon,
                                                        iconColor:
                                                            feature.iconColor,
                                                        value: feature.value,
                                                        link: feature.link,
                                                    }}
                                                />
                                            </div>
                                        ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center">
                            {manageFeatures.map((feature, index) => (
                                <div key={index}>
                                    <FeatureBox
                                        feature={{
                                            label: feature.label,
                                            icon: feature.icon,
                                            iconColor: feature.iconColor,
                                            value: feature.value,
                                            link: feature.link,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="m-2 py-1 ml-2 mr-4">
                        <div className="mt-1 flex space-x-2">
                            <span className="text-sm bg-blue-200 p-1 rounded">
                                Molecular biology
                            </span>
                            <span className="text-sm bg-blue-200 p-1 rounded">
                                Machine learning
                            </span>
                        </div>
                    </div>
                    <div className="border-t border-gray-300">
                        <div className="p-2 mx-2">
                            <span className="text-gray-800 text-base font-semibold">
                                Project Description:
                            </span>
                            <p className="text-gray-600">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectCardUI;
