"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/src/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import { DiscussionInfo, GeneralInfo } from "@/src/types/infoTypes";
import { useDeleteModeContext } from "@/src/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/src/contexts/general/PageSelectContext";
import { useBookmarksSearch } from "@/src/hooks/fetch/search-hooks/community/useBookmarksSearch";
import { MediumProjectCard } from "@/src/types/projectTypes";
import NavigationMenu from "@/src/components/headers/NavigationMenu";
import {
    bookmarksPageNavigationMenuItems,
    managementTypes,
    workTypes,
} from "@/src/config/navItems.config";
import ProjectSearchResults from "@/src/components/lists/ProjectsSearchResults";
import PageSelect from "@/src/components/complex-elements/PageSelect";
import { WorkSmall } from "@/src/types/workTypes";
import { ManagementSmall } from "@/src/types/managementTypes";
import { DiscussionSmall } from "@/src/types/communityTypes";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/src/config/availableSearchOptionsSimple";
import WorkspaceNoUserFallback from "@/src/components/fallback/WorkspaceNoUserFallback";
import WorkspaceTable from "@/src/components/lists/WorkspaceTable";
const DiscussionList = dynamic(() => import("@/src/components/community/discussions/DiscussionList"));

export default function BookmarksPage({ params }: { params: { userId: string } }) {
    // States
    const [activeTab, setActiveTab] = useState<string>("Projects");

    // Contexts
    const currentUserId = useUserId();
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();
    const { selectedPage } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const bookmarksData = useBookmarksSearch({
        enabled: !!currentUserId,
        context: "Reusable",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
        tableFilters: { user_id: currentUserId },
    });

    // Find bookmarks for each object type
    const projectBookmarks: MediumProjectCard[] = bookmarksData.data
        .filter((bookmark) => bookmark.objectType === "Project")
        .map((bookmarkData) => bookmarkData.bookmarkData as MediumProjectCard);

    const workBookmarks: WorkSmall[] = bookmarksData.data
        .filter((bookmark) => workTypes.includes(bookmark.objectType))
        .map((bookmarkResult) => bookmarkResult.bookmarkData as WorkSmall);

    const managementBookmarks: ManagementSmall[] = bookmarksData.data
        .filter((bookmark) => managementTypes.includes(bookmark.objectType))
        .map((bookmarkResult) => bookmarkResult.bookmarkData as ManagementSmall);

    const discussionBookmarks: DiscussionSmall[] = bookmarksData.data
        .filter((bookmark) => bookmark.objectType === "Discussion")
        .map((bookmarkResult) => bookmarkResult.bookmarkData as DiscussionSmall);

    // Getting data ready for display
    let workBookmarksInfo: GeneralInfo[] = [];
    let managementBookmarksInfo: GeneralInfo[] = [];
    let discussionBookmarksInfo: DiscussionInfo[] = [];

    if (workBookmarks) {
        workBookmarksInfo = workBookmarks.map((bookmark) => ({
            id: bookmark.id,
            icon: faFlask,
            itemType: "bookmarks",
            title: bookmark.title,
            // title: bookmark.title,
            // createdAt: bookmark.createdAt,
            // description: bookmark.description,
            // users: [],
        }));
    }

    if (managementBookmarks) {
        managementBookmarksInfo = managementBookmarks.map((bookmark) => ({
            id: bookmark.id,
            icon: faFlask,
            itemType: "bookmarks",
            title: bookmark.title,
            // objectType: bookmark.objectType,
            createdAt: bookmark.createdAt,
            users: bookmark.users,
            public: bookmark.public,
            // title: bookmark.title,
            // createdAt: bookmark.createdAt,
            // description: bookmark.description,
            // users: [],
        }));
    }

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Bookmarks"}
                searchBarPlaceholder="Search bookmarks..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onDelete={toggleDeleteMode}
                searchContext="Reusable"
            />
            <NavigationMenu
                items={bookmarksPageNavigationMenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="border-b border-gray-200 pt-4"
            />
            <div className="w-full">
                {activeTab === "Projects" && (
                    <div>
                        <div className="border-b border-gray-300 pr-4 px-6 py-4"></div>
                        <ProjectSearchResults
                            data={projectBookmarks || []}
                            isLoading={bookmarksData?.isLoading || false}
                            isError={bookmarksData?.serviceError}
                            viewMode={"collapsed"}
                            disableViewMode={true}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {projectBookmarks.length && projectBookmarks.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={projectBookmarks.length || 10}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "Works" && (
                    <div>
                        <WorkspaceTable
                            data={workBookmarksInfo || []}
                            isLoading={bookmarksData.isLoading}
                            isSuccess={bookmarksData.status === "success"}
                            itemType="bookmarks"
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {workBookmarks.length && workBookmarks.length >= itemsPerPage && (
                                <PageSelect
                                    numberOfElements={workBookmarks.length || 10}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "Management" && (
                    <div>
                        <WorkspaceTable
                            data={managementBookmarksInfo || []}
                            isLoading={bookmarksData.isLoading}
                            isSuccess={bookmarksData.status === "success"}
                            itemType="bookmarks"
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {managementBookmarks.length &&
                                managementBookmarks.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={managementBookmarks.length || 10}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Discussions" && (
                    <div>
                        <DiscussionList
                            discussions={discussionBookmarks || []}
                            isLoading={bookmarksData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {discussionBookmarks.length &&
                                discussionBookmarks.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={discussionBookmarks.length || 10}
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
