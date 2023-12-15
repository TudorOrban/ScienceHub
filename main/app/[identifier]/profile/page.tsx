"use client";

import React, { useState } from "react";
import { useIdByUsername } from "@/hooks/utils/useUserIdByUsername";
import useUserSettings from "@/hooks/utils/useUserSettings";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUserDataContext } from "@/contexts/current-user/UserDataContext";
import GeneralBox from "@/components/lists/GeneralBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAddressCard,
    faBuilding,
    faLink,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function ProfilePage({
    params,
}: {
    params: { identifier: string; projectId: string };
}) {
    // States
    const [editProfileOn, setEditProfileOn] = useState<boolean>(false);

    // Contexts
    const {
        userDetails,
        setUserDetails,
        isUser,
        identifier,
        currentTab,
        setCurrentTab,
        isLoading,
        setIsLoading,
    } = useUserDataContext();

    // Custom Hooks
    const currentUserId = useUserId();
    const {
        data: userId,
        isError,
        error,
    } = useIdByUsername({ username: params.identifier, enabled: isUser });

    const userSettingsData = useUserSettings(userId || "", !!userId);
       
    const isCurrentUserProfile = userId === currentUserId;
 
    if (!isUser) {
        return (
            <div>
                {identifier + " is not a valid username"}
            </div>
        )
    }

    return (
        <div className="">
            <div className="flex flex-grow w-full">
                <div className="flex w-full pl-4">
                    {/* Left side */}
                    <div className="flex-1 mt-4 mr-4 min-w-fit">
                        {/* About */}
                        <GeneralBox
                            title={"About"}
                            currentItems={[
                                {
                                    title: "Qualifications",
                                    content: userDetails?.qualifications,
                                },
                                {
                                    title: "Education",
                                    content: userDetails?.education,
                                },
                                {
                                    title: "Research Interests",
                                    content: userDetails?.researchInterests,
                                },
                                {
                                    title: "Affiliations",
                                    content: userDetails?.affiliations,
                                },
                            ]}
                            noFooter={true}
                            contentOn={true}
                            itemClassName="px-4"
                        />

                        {/* Info Boxes */}
                        <div className="space-y-4 pt-4">
                            <GeneralBox
                                title={"Contact information"}
                                currentItems={[
                                    {
                                        title: "Email(s)",
                                        content: userDetails?.email,
                                    },
                                    {
                                        title: "Phone number",
                                        content:
                                            userDetails?.contactInformation,
                                    },
                                    {
                                        title: "Office location",
                                        content:
                                            "Faculty of Mathematics and Computer Science, Bucharest, Romania",
                                    },
                                ]}
                                noFooter={true}
                                contentOn={true}
                                itemClassName="px-4"
                            />
                        </div>
                        <div className="space-y-4 pt-4">
                            <GeneralBox
                                title={"Research Highlights"}
                                currentItems={
                                    userSettingsData?.data[0]
                                        ?.researchHighlights || []
                                }
                                noFooter={true}
                            />
                        </div>
                    </div>

                    {/* Right side panel: user metadata */}
                    <div className="w-[320px] justify-end space-y-1 px-4 py-2 border-l border-gray-300 shadow-md h-full hidden md:block">
                        {((userDetails?.positions &&
                            userDetails?.positions.length > 0) ||
                            editProfileOn) && (
                            <div className="flex items-start text-gray-900">
                                <FontAwesomeIcon
                                    icon={faBuilding}
                                    className="small-icon text-gray-700 mr-2 mt-1"
                                />
                                <div className="flex flex-col flex-grow">
                                    <div className="flex flex-wrap items-center">
                                        <span className="font-semibold mr-1 whitespace-nowrap">
                                            {"Positions: "}
                                        </span>
                                        {userDetails?.positions?.map(
                                            (position, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex mr-2 items-center ${
                                                        editProfileOn
                                                            ? "bg-gray-200 p-0.5 border border-gray-400"
                                                            : ""
                                                    }`}
                                                >
                                                    <span>{position}</span>
                                                    {index <
                                                        (userDetails?.positions
                                                            ?.length || 0) -
                                                            1 && <span>,</span>}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {(userDetails?.contactInformation || editProfileOn) && (
                            <div className="flex items-center whitespace-nowrap text-gray-900">
                                <FontAwesomeIcon
                                    icon={faAddressCard}
                                    className="small-icon text-gray-700 mr-2"
                                />
                                <div className="font-semibold mr-1">
                                    {"Contact Information: "}
                                </div>
                                {userDetails?.contactInformation && userDetails?.contactInformation}
                            </div>
                        )}
                        {(userDetails?.location || editProfileOn) && (
                            <div className="flex items-center whitespace-nowrap text-gray-900">
                                <FontAwesomeIcon
                                    icon={faLocationDot}
                                    className="small-icon text-gray-700 mr-2"
                                />
                                <div className="font-semibold mr-1">
                                    {"Location: "}
                                </div>
                                {userDetails?.location && userDetails?.location}
                            </div>
                        )}
                        {((userDetails?.externalAccounts &&
                            userDetails?.externalAccounts.length > 0) ||
                            editProfileOn) && (
                            <div className="flex items-start text-gray-900">
                                <FontAwesomeIcon
                                    icon={faLink}
                                    className="small-icon text-gray-700 mr-2 mt-1"
                                />
                                <div className="flex flex-col flex-grow overflow-y-hidden">
                                    <div className="flex flex-wrap items-center font-normal ">
                                        <span className="font-semibold mr-1 whitespace-nowrap">
                                            {"External Accounts: "}
                                        </span>
                                        {userDetails?.externalAccounts?.map(
                                            (account, index) => (
                                                <div
                                                    key={index}
                                                    className="flex mr-2 items-center overflow-y-hidden"
                                                >
                                                    <span className="whitespace-nowrap mr-1">
                                                        {account.site + ": "}
                                                    </span>
                                                    <Link
                                                        href={account.link}
                                                        className="w-48 inline-block whitespace-nowrap text-blue-600 hover:underline text-ellipsis overflow-hidden"
                                                    >
                                                        {account.link}
                                                    </Link>
                                                    {index <
                                                        (userDetails
                                                            ?.externalAccounts
                                                            ?.length || 0) -
                                                            1 && <>,</>}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
