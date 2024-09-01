"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserbarState } from "@/src/contexts/sidebar-contexts/UserbarContext";
import Button from "../elements/Button";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import { useUsersSmall } from "@/src/hooks/utils/useUsersSmall";
import dynamic from "next/dynamic";
import useUserSettings from "@/src/hooks/utils/useUserSettings";
import { useUserSettingsContext } from "@/src/contexts/current-user/UserSettingsContext";
import deepEqual from "fast-deep-equal";
import { useUserCommunityActionsSmall } from "@/src/hooks/utils/useUserCommunityActionsSmall";
import { useUserActionsContext } from "@/src/contexts/current-user/UserActionsContext";
import { useUserSmallDataContext } from "@/src/contexts/current-user/UserSmallData";
import HeaderSearchInput from "../complex-elements/search-inputs/HeaderSearchInput";
import "@/styles/sidebar.scss";
import "@/styles/header.scss";
import AuthModal from "../auth/AuthModal";
import { useAuthModalContext } from "@/src/contexts/current-user/AuthModalContext";
const Userbar = dynamic(() => import("../complex-elements/Userbar"));

/**
 * Site Header. Used in root layout.
 * Includes Logo, main navigation pages, Search and authentication.
 */
const Header = () => {
    const [userInitials, setUserInitials] = useState<string>("");

    // Contexts
    const { isUserbarOpen, setIsUserbarOpen } = useUserbarState();
    // - User contexts
    const { isAuthModalOpen, setIsAuthModalOpen } = useAuthModalContext();
    const currentUserId = useUserId();
    const { userSmall, setUserSmall } = useUserSmallDataContext();
    const { userSettings, setUserSettings } = useUserSettingsContext();
    const { userActions, setUserActions } = useUserActionsContext();

    // Custom hooks: User data, settings and community actions
    // - User data
    const userSmallData = useUsersSmall([currentUserId ?? ""], !!currentUserId);
    const userSettingsData = useUserSettings(currentUserId ?? "", !!currentUserId);
    const userActionsData = useUserCommunityActionsSmall(currentUserId ?? "", !!currentUserId);

    // Effects: load data into contexts
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

    useEffect(() => {
        if (userSmall.data && userSmall.data.length > 0) {
            const user = userSmall.data[0];
            // Find capitalized characters in the username, at most 2
            const initials = user.username
                .split("")
                .filter((char) => char === char.toUpperCase())
                .slice(0, 2)
                .join("");
            setUserInitials(initials);
        }
    });

    return (
        <div className={`header`}>
            <Image
                src="/images/science-logo.jpg"
                width={36}
                height={36}
                alt="Picture of the website"
                className={`sm:ml-4 mr-2 ${
                    currentUserId ? "lg:mr-4 xl:mr-16" : "lg:mr-6 xl:mr-12"
                } border border-gray-400 rounded-md`}
            />
            {/* Navigation Links */}
            <div className="hidden md:flex md:space-x-12 lg:space-x-16 text-lg text-gray-50 mr-2 sm:mr-6 lg:mr-8 xl:mr-16">
                <Link href="/" className="hidden lg:inline-block">
                    Home
                </Link>
                <Link href="/workspace">Workspace</Link>
                <Link href="/browse">Browse</Link>
                <Link href="/resources" className="hidden xl:inline-block">
                    Resources
                </Link>
            </div>

            <div className="flex items-center space-x-3">
                {/* Searchbar */}
                <HeaderSearchInput
                    inputClassname={`${
                        currentUserId ? "w-64 md:w-80 lg:w-96" : "w-64 md:w-72 lg:w-80"
                    }`}
                />

                {/* Chats and notifications */}
                <div className="hidden md:flex items-center pl-4">
                    <Link
                        href={"/workspace/community/chats"}
                        className="flex items-center justify-center bg-gray-100 text-black w-9 h-9 mr-4 rounded-md border border-gray-400 "
                    >
                        <FontAwesomeIcon icon={faMessage} className="small-icon text-gray-700" />
                    </Link>
                    <button
                        className="flex items-center justify-center bg-gray-100 text-black w-9 h-9 rounded-md border border-gray-400"
                        onClick={() => {}}
                    >
                        <FontAwesomeIcon icon={faBell} className="small-icon text-gray-700" />
                    </button>
                </div>

                {/* Sign-in/Sign-up & Buttons */}
                <div className="hidden sm:flex items-center gap-x-4">
                    {currentUserId ? (
                        <div className="flex items-center mr-4">
                            <button
                                className="w-10 h-10 rounded-full border border-gray-700"
                                style={{ backgroundColor: "var(--sidebar-bg-color)", color: "var(--sidebar-text-color)" }}
                                onClick={() => {
                                    setIsUserbarOpen(!isUserbarOpen);
                                }}
                            >
                                <p>{userInitials}</p>
                            </button>

                            {isUserbarOpen && (
                                <Userbar
                                    setIsUserbarOpen={setIsUserbarOpen}
                                    userSmall={(userSmall.data ?? [])[0]}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4 pr-4">
                            <Button
                                className="auth-button"
                                onClick={() => setIsAuthModalOpen(!isAuthModalOpen)}
                            >
                                Sign up
                            </Button>
                            <Button
                                className="auth-button"
                                onClick={() => setIsAuthModalOpen(!isAuthModalOpen)}
                            >
                                Log in
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {isAuthModalOpen && <AuthModal />}
        </div>
    );
};

export default Header;
