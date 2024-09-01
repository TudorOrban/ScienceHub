"use client";

import { faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import NavigationMenu from "./NavigationMenu";
import { useState } from "react";
import { workspacePageNavigationMenuItems } from "@/src/config/navItems.config";
import ActionsButton from "../elements/ActionsButton";
import { User } from "@/src/types/userTypes";

interface WorkspaceOverviewHeaderProps {
    startingActiveTab: string;
    currentUser: User;
}

/**
 * Header for the Workspace root pages.
 * Buttons metrics etc. will be added in the future
 */
const WorkspaceOverviewHeader: React.FC<WorkspaceOverviewHeaderProps> = ({
    startingActiveTab,
    currentUser,
}) => {
    // States
    const [activeTab, setActiveTab] = useState<string>(startingActiveTab);

    return (
        <div style={{ backgroundColor: "var(--page-header-bg-color)" }}>
            {/* First part */}
            <div className="flex justify-between items-start px-10 pt-4 pb-8">
                {/* Left side: Title, User */}
                <div className="mr-4">
                    <h2 className="page-title my-2">Workspace</h2>
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
                        <span className="ml-1 text-blue-600 block">{currentUser?.username}</span>
                    </div>
                </div>

                {/* Right side: Metrics, buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <ActionsButton />
                    <Button variant="default" className="standard-write-button">
                        <FontAwesomeIcon icon={faPlus} className="small-icon mr-2" />
                        Add to Workspace
                    </Button>
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
