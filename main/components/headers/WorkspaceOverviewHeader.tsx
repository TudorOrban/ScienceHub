"use client";

import {
    faEllipsis,
    faPlus,
    faQuoteRight,
    faShare,
    faUpLong,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionButton from "../elements/ActionButton";
import { Button } from "../ui/button";
import NavigationMenu from "./NavigationMenu";
import { useEffect, useState } from "react";
import { workspacePageNavigationMenuItems } from "@/config/navItems.config";
import { User } from "@supabase/supabase-js";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import ActionsButton from "../elements/ActionsButton";
import { usePathname } from "next/navigation";

interface WorkspaceOverviewHeaderProps {}

const WorkspaceOverviewHeader: React.FC<WorkspaceOverviewHeaderProps> = (
    props
) => {
    // States
    const [activeTab, setActiveTab] = useState<string>("Overview");
    const [isInRoot, setIsInRoot] = useState<boolean>(false);

    // Contexts
    const currentUserId = useUserId();
    const userData = useUsersSmall([currentUserId || ""], !!currentUserId);

    const currentUser = userData.data[0];

    const pathname = usePathname();
    const splittedPath = pathname.split("/");
    const isAtRoot = splittedPath.length <= 2;

    // Effects
    // - Sync nav menu with pathname change
    useEffect(() => {
        setIsInRoot(false);
        if (isAtRoot) {
            setIsInRoot(true);
            if (splittedPath[2]) {
                setActiveTab(
                    splittedPath[2].charAt(0).toUpperCase() +
                        splittedPath[2].slice(1)
                );
            } else {
                setActiveTab("Overview");
            }
        }
    }, [pathname]);

    if (!isInRoot) {
        return null;
    }
    
    return (
        <div style={{ backgroundColor: "var(--page-header-bg-color)" }}>
            {/* First part */}
            <div className="flex justify-between items-start px-10 pt-4 pb-8">
                {/* Left side: Title, User */}
                <div className="mr-4">
                    <h2 className="text-3xl font-bold text-primary mb-4 ml-2 mt-4">
                        Workspace
                    </h2>
                    <div className="flex items-center text-gray-600 text-lg flex-wrap">
                        <FontAwesomeIcon
                            className="small-icon"
                            icon={faUser}
                            style={{
                                marginLeft: "0.2em",
                                marginRight: "0.25em",
                                marginTop: "0em",
                            }}
                            color="#444444"
                        />
                        <span className="ml-1 text-blue-600 block">
                            {currentUser?.username}
                        </span>
                    </div>
                </div>

                {/* Right side: Metrics, buttons */}
                <div>
                    <div className="w-40 h-20 bg-white rounded-md border border-gray-200">
                        S
                    </div>
                    <div className="flex justify-end space-x-3">
                        <ActionsButton />
                        <Button variant="default" className="create-button">
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="small-icon mr-2"
                            />
                            Add to Workspace
                        </Button>
                    </div>
                </div>
            </div>
            <NavigationMenu
                items={workspacePageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="space-x-6 pt-1 border-b border-gray-300 shadow-sm"
                pagesMode={true}
            />
        </div>
    );
};

export default WorkspaceOverviewHeader;
