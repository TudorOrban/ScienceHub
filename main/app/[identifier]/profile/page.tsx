"use client";

import React, { useState } from "react";
import { useIdByUsername } from "@/hooks/utils/useUserIdByUsername";
import useUserSettings from "@/hooks/utils/useUserSettings";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { UserProfileChanges, useUserDataContext } from "@/contexts/current-user/UserDataContext";
import GeneralBox from "@/components/lists/GeneralBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAddressCard,
    faBuilding,
    faLink,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useUserSettingsContext } from "@/contexts/current-user/UserSettingsContext";
import UserProfileEditableTextField from "@/components/complex-elements/UserProfileEditableTextField";
import ReusableBox from "@/components/elements/ReusableBox";

function ProfilePage({ params }: { params: { identifier: string; projectId: string } }) {
    // Contexts
    const {
        userDetails,
        setUserDetails,
        isUser,
        identifier,
        currentTab,
        setCurrentTab,
        editProfileOn,
        currentEdits,
        setCurrentEdits,
        isLoading,
        setIsLoading,
    } = useUserDataContext();

    const { userSettings } = useUserSettingsContext();

    const currentUserId = useUserId();

    // Custom Hooks
    const {
        data: userId,
        isError,
        error,
    } = useIdByUsername({ username: params.identifier, enabled: isUser });

    const isCurrentUserProfile = userId === currentUserId;


    if (!isUser) {
        return <div>{identifier + " is not a valid username"}</div>;
    }

    return (
        <div className="">
            <div className="flex flex-grow w-full">
                <div className="flex w-full pl-4">
                    {/* Left side */}
                    <div className="flex-1 mt-4 mr-4 min-w-fit space-y-4">
                        {/* About */}
                        <ReusableBox label="About">
                            <UserProfileEditableTextField
                                label={"Qualifications"}
                                fieldKey={"qualifications"}
                                initialVersionContent={userDetails?.qualifications || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Education"}
                                fieldKey={"education"}
                                initialVersionContent={userDetails?.education || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Research Interests"}
                                fieldKey={"research_interests"}
                                initialVersionContent={userDetails?.researchInterests || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Affiliations"}
                                fieldKey={"affiliations"}
                                initialVersionContent={userDetails?.affiliations || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                        </ReusableBox>
                        <ReusableBox label="Contact Information">
                            <UserProfileEditableTextField
                                label={"Email"}
                                fieldKey={"email"}
                                initialVersionContent={userDetails?.email || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Phone number"}
                                fieldKey={"contact_information"}
                                initialVersionContent={userDetails?.contactInformation || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Office Location"}
                                fieldKey={"location"}
                                initialVersionContent={userDetails?.location || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                        </ReusableBox>
                        <div className="space-y-4 pt-4">
                            <GeneralBox
                                title={"Research Highlights"}
                                currentItems={userSettings.data[0]?.researchHighlights || []}
                                noFooter={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
