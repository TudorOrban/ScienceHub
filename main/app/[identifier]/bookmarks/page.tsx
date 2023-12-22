"use client";

import React, { useState } from "react";
import ListHeaderUI from "@/components/headers/ListHeaderUI";
import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { DiscussionInfo, GeneralInfo } from "@/types/infoTypes";
import { useDeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { usePageSelectContext } from "@/contexts/general/PageSelectContext";
import { useBookmarksSearch } from "@/hooks/fetch/search-hooks/community/useBookmarksSearch";
import { MediumProjectCard } from "@/types/projectTypes";
import NavigationMenu from "@/components/headers/NavigationMenu";
import {
    bookmarksPageNavigationMenuItems,
    managementTypes,
    workTypes,
} from "@/config/navItems.config";
import ProjectSearchResults from "@/components/lists/ProjectsSearchResults";
import PageSelect from "@/components/complex-elements/PageSelect";
import { WorkSmall } from "@/types/workTypes";
import { ManagementSmall } from "@/types/managementTypes";
import { DiscussionSmall } from "@/types/communityTypes";
import dynamic from "next/dynamic";
import { defaultAvailableSearchOptions } from "@/config/availableSearchOptionsSimple";
const GeneralList = dynamic(
    () => import("@/components/lists/GeneralList")
);
const DiscussionList = dynamic(
    () => import("@/components/lists/community/DiscussionList")
);


export default function BookmarksPage({
    params,
}: {
    params: { userId: string };
}) {
    // States
    // - Active tab
    const [activeTab, setActiveTab] = useState<string>("Projects");
    
    // - Create
    const [createNewOn, setCreateNewOn] = useState<boolean>(false);
    const onCreateNew = () => {
        setCreateNewOn(!createNewOn);
    };

    // Contexts
    // - Current user
    const currentUserId = useUserId();

    // - Delete
    const { isDeleteModeOn, toggleDeleteMode } = useDeleteModeContext();

    // - Select page
    const { selectedPage, setSelectedPage, setListId } = usePageSelectContext();
    const itemsPerPage = 20;

    // Custom Hooks
    const bookmarksData = useBookmarksSearch({
        enabled: !!currentUserId,
        context: "Project General",
        page: selectedPage,
        itemsPerPage: itemsPerPage,
        tableFilters: { user_id: currentUserId },
    });
    
    const projectBookmarks: MediumProjectCard[] = bookmarksData.data
        .filter((bookmark) => bookmark.objectType === "Project")
        .map((bookmarkData) => bookmarkData.bookmarkData as MediumProjectCard);

    const workBookmarks: WorkSmall[] = bookmarksData.data
        .filter((bookmark) => workTypes.includes(bookmark.objectType))
        .map((bookmarkResult) => bookmarkResult.bookmarkData as WorkSmall);

    const managementBookmarks: ManagementSmall[] = bookmarksData.data
        .filter((bookmark) => managementTypes.includes(bookmark.objectType))
        .map(
            (bookmarkResult) => bookmarkResult.bookmarkData as ManagementSmall
        );

    const discussionBookmarks: DiscussionSmall[] = bookmarksData.data
        .filter((bookmark) => bookmark.objectType === "Discussion")
        .map(
            (bookmarkResult) => bookmarkResult.bookmarkData as DiscussionSmall
        );
    // const { projectData } = useBookmarksData(
    //     bookmarksData.data.filter(
    //         (bookmark) => bookmark.objectType === "Project"
    //     )
    // );

    console.log("SDAS", bookmarksData, projectBookmarks);

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

    if (discussionBookmarks) {
        discussionBookmarksInfo = discussionBookmarks.map((bookmark) => ({
            id: bookmark.id,
            icon: faFlask,
            itemType: "bookmarks",
            user: bookmark.user || { id: "", username: "", fullName: "" },
            title: bookmark.title,
            createdAt: bookmark.createdAt,
            content: bookmark.content,
            // title: bookmark.title,
            // createdAt: bookmark.createdAt,
            // description: bookmark.description,
            // users: [],
        }));
    }

    return (
        <div>
            <ListHeaderUI
                breadcrumb={true}
                title={"Bookmarks"}
                searchBarPlaceholder="Search bookmarks..."
                sortOptions={defaultAvailableSearchOptions.availableSortOptions}
                onCreateNew={onCreateNew}
                onDelete={toggleDeleteMode}
                searchContext="Project General"
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
                            onDeleteProject={() => {}}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {projectBookmarks.length &&
                                projectBookmarks.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            projectBookmarks.length || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Works" && (
                    <div>
                        <GeneralList
                            data={workBookmarksInfo || []}
                            isLoading={bookmarksData.isLoading}
                            isSuccess={bookmarksData.status === "success"}
                            itemType="bookmarks"
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {workBookmarks.length &&
                                workBookmarks.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            workBookmarks.length || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Management" && (
                    <div>
                        <GeneralList
                            data={managementBookmarksInfo || []}
                            isLoading={bookmarksData.isLoading}
                            isSuccess={bookmarksData.status === "success"}
                            itemType="bookmarks"
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {managementBookmarks.length &&
                                managementBookmarks.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            managementBookmarks.length || 10
                                        }
                                        itemsPerPage={itemsPerPage}
                                    />
                                )}
                        </div>
                    </div>
                )}
                {activeTab === "Discussions" && (
                    <div>
                        <DiscussionList
                            data={discussionBookmarksInfo || []}
                            onDeleteDiscussion={() => {}}
                            // isLoading={bookmarksData.isLoading}
                        />
                        <div className="flex justify-end my-4 mr-4">
                            {discussionBookmarks.length &&
                                discussionBookmarks.length >= itemsPerPage && (
                                    <PageSelect
                                        numberOfElements={
                                            discussionBookmarks.length || 10
                                        }
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
