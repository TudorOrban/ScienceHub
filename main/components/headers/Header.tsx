"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useAuthModal from "@/app/hooks/useAuthModal";
import { useUser } from "@/app/hooks/useUser";
import { useUserbarState } from "@/app/contexts/sidebar-contexts/UserbarContext";
import SearchInput from "@/components/complex-elements/SearchInput";
import Button from "../elements/Button";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { useUsersSmall } from "@/app/hooks/utils/useUsersSmall";
import "@/app/styles/sidebar.scss";
import "@/app/styles/header.scss";
import dynamic from "next/dynamic";
import useUserSettings from "@/app/hooks/utils/useUserSettings";
import { useUserSettingsContext } from "@/app/contexts/current-user/UserSettingsContext";
import deepEqual from "fast-deep-equal";
import { useUserCommunityActionsSmall } from "@/app/hooks/utils/useUserCommunityActionsSmall";
import { useUserActionsContext } from "@/app/contexts/current-user/UserActionsContext";
import { useUserSmallDataContext } from "@/app/contexts/current-user/UserSmallData";

const Userbar = dynamic(() => import("../complex-elements/Userbar"));


const Header = () => {
    // Auth
    const authModal = useAuthModal();
    
    // Contexts
    // - Sidebar
    const { isUserbarOpen, setIsUserbarOpen } = useUserbarState();

    // - User contexts
    const { user } = useUser();
    const currentUserId = useUserId();

    const { userSmall, setUserSmall } = useUserSmallDataContext();
    const { userSettings, setUserSettings } = useUserSettingsContext();
    const { userActions, setUserActions } = useUserActionsContext();
    
    // Custom hooks
    // - User data
    const userSmallData = useUsersSmall([currentUserId || ""], !!currentUserId);

    // - User settings
    const userSettingsData = useUserSettings(currentUserId || "", !!currentUserId);

    // - User community actions
    const userActionsData = useUserCommunityActionsSmall(currentUserId || "", !!currentUserId);

    // Effects
    // Load data into contexts
    useEffect(() => {
        if (userSmallData.data && !deepEqual(userSmallData.data, userSmall.data)) {
            setUserSmall(userSmallData);
        }
    }, [userSmallData]);

    useEffect(() => {
        if (userSettingsData.data && !deepEqual(userSettingsData.data, userSettings.data)) {
            setUserSettings(userSettingsData);
        }
    }, [userSettingsData]);

    useEffect(() => {
        if (userActionsData.data && !deepEqual(userActionsData.data, userActions.data)) {
            setUserActions(userActionsData);
        }
    }, [userActionsData]);
    
    return (
        <div
            className={`header`}
        >
            <Image
                src="/images/science-logo.jpg"
                width={36}
                height={36}
                alt="Picture of the website"
                className={`ml-4 ${
                    user ? "mr-16" : "mr-12"
                } border border-gray-400 rounded-md`}
            />
            {/* Navigation Links */}
            <div className="flex-1 space-x-20 text-lg text-gray-50 lg:flex mr-16">
                <Link href="/">Home</Link>
                <Link href="/workspace">Workspace</Link>
                <Link href="/browse">Browse</Link>
                <Link href="/resources">Resources</Link>
            </div>

            {/* Searchbar */}
            <div className="flex items-center space-x-3">
                <SearchInput
                    placeholder={"Search ScienceHub"}
                    context={"Header"}
                    searchMode={"onClick"}
                    inputClassName={`${
                        user ? "w-96" : "w-80"
                    }`}
                />
                {/* Chats and notifications */}
                <div className="flex items-center pl-4">
                    <button
                        className="flex items-center justify-center bg-gray-100 text-black w-9 h-9 mr-4 rounded-md border border-gray-400 "
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon
                            icon={faMessage}
                            className="small-icon text-gray-700"
                        />
                    </button>
                    <button
                        className="flex items-center justify-center bg-gray-100 text-black w-9 h-9 rounded-md border border-gray-400"
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon
                            icon={faBell}
                            className="small-icon text-gray-700"
                        />
                    </button>
                </div>

                {/* Sign-in/Sign-up & Buttons */}
                <div className="flex items-center gap-x-4">
                    {user ? (
                        <>
                            <div className="flex items-center mr-4">
                                <button
                                    className="text-white ml-2"
                                    onClick={() => {
                                        setIsUserbarOpen(
                                            (prevState) => !prevState
                                        );
                                    }}
                                >
                                    <Image
                                        src="/images/blank-avatar-image.png"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                        alt={"Avatar Image"}
                                    />
                                </button>

                                {isUserbarOpen && (
                                    <Userbar
                                        setIsUserbarOpen={setIsUserbarOpen}
                                        userSmall={(userSmall.data || [])[0]}
                                        // userSmall={{ id: "0awqwq", username: "", fullName: ""}}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4 pr-4">
                            <Button
                                className="auth-button"
                                onClick={authModal.onOpen}
                            >
                                Sign up
                            </Button>
                            <Button
                                className="auth-button"
                                onClick={authModal.onOpen}
                            >
                                Log in
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
