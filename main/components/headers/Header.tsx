"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useAuthModal from "@/hooks/auth/useAuthModal";
import { useUser } from "@/hooks/auth/useUser";
import { useUserbarState } from "@/contexts/sidebar-contexts/UserbarContext";
import Button from "../elements/Button";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import dynamic from "next/dynamic";
import useUserSettings from "@/hooks/utils/useUserSettings";
import { useUserSettingsContext } from "@/contexts/current-user/UserSettingsContext";
import deepEqual from "fast-deep-equal";
import { useUserCommunityActionsSmall } from "@/hooks/utils/useUserCommunityActionsSmall";
import { useUserActionsContext } from "@/contexts/current-user/UserActionsContext";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import HeaderSearchInput from "../complex-elements/search-inputs/HeaderSearchInput";
import "@/styles/sidebar.scss";
import "@/styles/header.scss";
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
        <div className={`header`}>
            <Image
                src="/images/science-logo.jpg"
                width={36}
                height={36}
                alt="Picture of the website"
                className={`sm:ml-4 mr-2 ${
                    user ? "lg:mr-8 xl:mr-16" : "lg:mr-6 xl:mr-12"
                } border border-gray-400 rounded-md`}
            />
            {/* Navigation Links */}
            <div className="hidden lg:flex md:space-x-12 lg:space-x-20 text-lg text-gray-50 mr-2 lg:mr-8 xl:mr-16">
                <Link href="/">Home</Link>
                <Link href="/workspace">Workspace</Link>
                <Link href="/browse">Browse</Link>
                <Link href="/resources" className="hidden xl:inline-block">
                    Resources
                </Link>
            </div>

            <div className="flex items-center space-x-3">
                {/* Searchbar */}
                <HeaderSearchInput
                    inputClassname={`${user ? "w-64 md:w-80 lg:w-96" : "w-64 md:w-72 lg:w-80"}`}
                />

                {/* Chats and notifications */}
                <div className="hidden md:flex items-center pl-4">
                    <button
                        className="flex items-center justify-center bg-gray-100 text-black w-9 h-9 mr-4 rounded-md border border-gray-400 "
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon icon={faMessage} className="small-icon text-gray-700" />
                    </button>
                    <button
                        className="flex items-center justify-center bg-gray-100 text-black w-9 h-9 rounded-md border border-gray-400"
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon icon={faBell} className="small-icon text-gray-700" />
                    </button>
                </div>

                {/* Sign-in/Sign-up & Buttons */}
                <div className="hidden sm:flex items-center gap-x-4">
                    {user ? (
                        <>
                            <div className="flex items-center mr-4">
                                <button
                                    className="text-white ml-2 w-10 h-10"
                                    onClick={() => {
                                        setIsUserbarOpen(!isUserbarOpen);
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
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4 pr-4">
                            <Button className="auth-button" onClick={authModal.onOpen}>
                                Sign up
                            </Button>
                            <Button className="auth-button" onClick={authModal.onOpen}>
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
