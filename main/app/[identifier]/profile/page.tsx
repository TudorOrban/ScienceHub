"use client";

import React from "react";
import { useIdByUsername } from "@/hooks/utils/useUserIdByUsername";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUserDataContext } from "@/contexts/current-user/UserDataContext";
import GeneralBox from "@/components/lists/GeneralBox";
import { useUserSettingsContext } from "@/contexts/current-user/UserSettingsContext";
import UserProfileEditableTextField from "@/components/complex-elements/UserProfileEditableTextField";
import ReusableBox from "@/components/elements/ReusableBox";
import UserProfileHeader from "@/components/headers/UserProfileHeader";
import useUserDetails from "@/hooks/utils/useUserDetails";

export const revalidate = 3600;

// User profile page
function ProfilePage({ params }: { params: { identifier: string; projectId: string } }) {
    // Get user data from context (received in [identifier] layout) - TO BE REMOVED
    const {
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

    // Get id from username and fetch user details
    const {
        data: userId,
        isError,
        error,
    } = useIdByUsername({ username: params.identifier, enabled: isUser });

    const userData = useUserDetails(userId || "", isUser && !!userId);


    if (!isUser) {
        return <div>{identifier + " is not a valid username"}</div>;
    }

    return (
        <div className="">
            <UserProfileHeader startingActiveTab="Overview" userDetailsRefetch={userData.refetch} />
            <div className="flex flex-grow w-full py-4">
                <div className="flex w-full pl-4">
                    {/* Left side */}
                    <div className="flex-1 mr-4 min-w-fit space-y-4">

                        {/* About */}
                        <ReusableBox label="About" className="" isLoading={userData.isLoading}>
                            <UserProfileEditableTextField
                                label={"Qualifications"}
                                fieldKey={"qualifications"}
                                initialVersionContent={userData.data?.[0]?.qualifications || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Education"}
                                fieldKey={"education"}
                                initialVersionContent={userData.data?.[0]?.education || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Research Interests"}
                                fieldKey={"research_interests"}
                                initialVersionContent={userData.data?.[0]?.researchInterests || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Affiliations"}
                                fieldKey={"affiliations"}
                                initialVersionContent={userData.data?.[0]?.affiliations || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                        </ReusableBox>

                        {/* Contact Info */}
                        <ReusableBox label="Contact Information" isLoading={userData.isLoading}>
                            <UserProfileEditableTextField
                                label={"Email"}
                                fieldKey={"email"}
                                initialVersionContent={userData.data?.[0]?.email || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Phone number"}
                                fieldKey={"contact_information"}
                                initialVersionContent={userData.data?.[0]?.contactInformation || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                            <UserProfileEditableTextField
                                label={"Office Location"}
                                fieldKey={"location"}
                                initialVersionContent={userData.data?.[0]?.location || ""}
                                isEditModeOn={editProfileOn}
                                currentEdits={currentEdits}
                                setCurrentEdits={setCurrentEdits}
                            />
                        </ReusableBox>

                        {/* Research Highlights */}
                        <div className="space-y-4">
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
