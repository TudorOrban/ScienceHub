"use client";

import {
    IconDefinition,
    faAddressBook,
    faBan,
    faBookJournalWhills,
    faBuilding,
    faCalendar,
    faCopy,
    faEdit,
    faEllipsis,
    faEye,
    faFlag,
    faFolderClosed,
    faLink,
    faLocation,
    faLocationDot,
    faMessage,
    faPaperclip,
    faQuestion,
    faQuoteRight,
    faSave,
    faShare,
    faTableList,
    faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMetricsFeatures, getUserProfileNavigationMenuItems } from "@/config/navItems.config";
import Image from "next/image";
import NavigationMenu from "./NavigationMenu";
import { useEffect, useState } from "react";
import ActionButton from "../elements/ActionButton";
import { Button } from "../ui/button";
import MetricsPanel from "../complex-elements/MetricsPanel";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUserDataContext } from "@/contexts/current-user/UserDataContext";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useIdByUsername } from "@/hooks/utils/useUserIdByUsername";
import useUserDetails from "@/hooks/utils/useUserDetails";
import useUserSettings from "@/hooks/utils/useUserSettings";
import { usePathname } from "next/navigation";
import { UserFullDetails } from "@/types/userTypes";
import { formatDate } from "@/utils/functions";
import { useWindowSize } from "@/hooks/utils/getWindowSize";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
const ActionsButton = dynamic(() => import("@/components/elements/ActionsButton"));

interface UserProfileHeaderProps {
    initialUserDetails?: UserFullDetails;
    initialIsUser?: boolean;
    initialIsLoading?: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
    initialUserDetails,
    initialIsUser,
    initialIsLoading,
}) => {
    // States
    const [renderHeader, setRenderHeader] = useState<boolean>(false);
    const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

    // Contexts
    const pathname = usePathname();
    const splittedPath = pathname.split("/");
    const isAtRoot = splittedPath.length <= 3;

    const currentUserId = useUserId();

    const {
        userDetails,
        setUserDetails,
        isUser,
        identifier,
        editProfileOn,
        setEditProfileOn,
        currentEdits,
        setCurrentEdits,
        currentTab,
        setCurrentTab,
        isLoading,
        setIsLoading,
    } = useUserDataContext();

    // Custom Hooks
    const {
        data: userId,
        isError,
        error,
    } = useIdByUsername({
        username: identifier || "",
        enabled: isUser && !!identifier,
    });
    const userData = useUserDetails(userId || "", isUser && !!userId);
    const isCurrentUserProfile = userId === currentUserId;

    // const userSettingsData = useUserSettings(userId || "", isUser && !!userId);

    useEffect(() => {
        if (initialUserDetails || userData.data) {
            setUserDetails(initialUserDetails || userData.data[0]);
        }
    }, [userData]);

    // - Sync nav menu with pathname change
    useEffect(() => {
        setRenderHeader(false);
        if (!isUser && !initialIsUser) {
            setRenderHeader(false);
        } else {
            if (isAtRoot) {
                setRenderHeader(true);
                if (splittedPath[2] && splittedPath[2] !== "profile") {
                    setCurrentTab(
                        splittedPath[2].charAt(0).toUpperCase() + splittedPath[2].slice(1)
                    );
                } else if (splittedPath[2] === "profile") {
                    setCurrentTab("Overview");
                }
            } else {
                setRenderHeader(false);
            }
        }
    }, [pathname, isUser]);

    const updateGeneral = useUpdateGeneralData();
    
    const handleSaveProfileChanges = async () => {
        if (!userDetails?.id) { return; }
        setIsSaveLoading(true);

        const updatedUserDetails = await updateGeneral.mutateAsync({
            tableName: "users",
            identifierField: "id",
            identifier: userDetails?.id || "",
            updateFields: currentEdits,
        });

        setEditProfileOn(false);
        setIsSaveLoading(false);
        userData.refetch?.();
    }

    if (!renderHeader) {
        return null;
    }

    return (
        <div
            style={{ backgroundColor: "var(--page-header-bg-color)" }}
            className="border-b border-gray-200 shadow-sm"
        >
            {/* UserProfileHeader: in layout.tsx */}
            {/* First part */}
            <div className="flex justify-between flex-wrap md:flex-nowrap items-center px-10 pt-4 pb-4">
                {/* Left side: Profile */}
                <div className="mr-4">
                    <div className="flex items-center">
                        <div className="w-20 h-20 mr-4">
                            <Image
                                src={userDetails?.avatarUrl || "/images/githublogo.png"}
                                alt="User Avatar"
                                className="rounded-full w-full h-full"
                                width={80}
                                height={80}
                            />
                        </div>
                        <div className="">
                            <h2 className="text-2xl font-semibold text-primary">
                                {userDetails?.fullName}
                            </h2>
                            <div className="flex flex-wrap">
                                {editProfileOn && (
                                    <span className="font-semibold mr-1">
                                        {"Bio: "}
                                    </span>
                                )}
                                {userDetails?.bio || ""}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                        <div className="flex items-center whitespace-nowrap text-gray-900">
                            <FontAwesomeIcon
                                icon={faAddressBook}
                                className="small-icon text-gray-700 mr-2"
                            />
                            <div className="font-semibold mr-1">{"Followers: "}</div>
                            {userDetails?.followers?.length || 0}
                            {","}
                        </div>
                        <div className="flex items-center whitespace-nowrap text-gray-900">
                            <div className="font-semibold mr-1">{"Following: "}</div>
                            {userDetails?.following?.length || 0}
                        </div>
                    </div>
                    <div className="flex items-center whitespace-nowrap text-gray-900 pt-2">
                        <FontAwesomeIcon
                            icon={faCalendar}
                            className="small-icon text-gray-700 mr-2"
                        />
                        <div className="font-semibold mr-1">{"Joined at: "}</div>
                        {formatDate(userDetails?.createdAt || "")}
                    </div>
                </div>

                {/* Rightside: Metrics and Buttons */}
                <div>
                    <MetricsPanel
                        researchMetrics={[
                            {
                                label: "Research Score",
                                value: userDetails?.researchScore?.toString(),
                                icon: faBookJournalWhills,
                            },
                            {
                                label: "h-Index",
                                value: userDetails?.hIndex?.toString(),
                                icon: faTableList,
                            },
                            {
                                label: "Total Citations",
                                value: userDetails?.totalCitations?.toString(),
                                icon: faPaperclip,
                            },
                        ]}
                        communityMetrics={[
                            {
                                label: "Views",
                                // value: userDetails?.views?.toString(),
                                icon: faEye,
                            },
                            {
                                label: "Upvotes",
                                // value: userDetails?.upvotes?.toString(),
                                icon: faUpLong,
                            },
                            {
                                label: "Shares",
                                // value: userDetails?.shares?.toString(),
                                icon: faAddressBook,
                            },
                        ]}
                        isLoading={isLoading}
                    />
                    <div className="flex justify-end space-x-4 my-4">
                        <ActionsButton
                            actions={[
                                { label: "Follow", icon: faAddressBook, onClick: () => {} },
                                { label: "Recommend", icon: faUpLong, onClick: () => {} },
                                { label: "Chat", icon: faMessage, onClick: () => {} },
                                {
                                    label: "Copy profile link",
                                    icon: faCopy,
                                    onClick: () => {},
                                },
                                { label: "Report", icon: faFlag, onClick: () => {} },
                                { label: "Block", icon: faBan, onClick: () => {} },
                            ]}
                        />
                        {isCurrentUserProfile && !editProfileOn && (
                            <button
                                className={`edit-button`}
                                onClick={() => setEditProfileOn(true)}
                            >
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="small-icon text-white mr-1"
                                />
                                {"Edit Profile"}
                            </button>
                        )}
                        {isCurrentUserProfile && editProfileOn && (
                            <button
                                onClick={handleSaveProfileChanges}
                                className="flex items-center standard-write-button"
                            >
                                <FontAwesomeIcon icon={faSave} className="small-icon mr-1" />
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu and Buttons */}
            <div className="flex items-center w-full justify-between pr-10 pl-2 border-b border-gray-300 shadow-sm">
                <NavigationMenu
                    items={getUserProfileNavigationMenuItems(
                        userDetails?.username || "",
                        isCurrentUserProfile
                    )}
                    activeTab={currentTab}
                    setActiveTab={setCurrentTab}
                    className="space-x-6 pt-1 mr-4"
                    pagesMode={true}
                />
            </div>
            {isSaveLoading && (
                <div className="absolute left-40 top-80 text-xl bg-white w-40 h-20 border border-gray-200">Loading...</div>
            )}
        </div>
    );
};

export default UserProfileHeader;

// const externalAccountsIcons: Record<string, IconDefinition> = {
//     "Twitter": faXTwitter,
//     "Research Gate": faResearchgate,

// };
