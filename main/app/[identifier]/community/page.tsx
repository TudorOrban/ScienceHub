"use client";

import CustomTable from "@/components/lists/CustomTable";
import { formatDate, truncateText } from "@/utils/functions";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfoCircle, faPaste, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useDiscussionsSearch } from "@/hooks/fetch/search-hooks/community/useDiscussionsSearch";
import { useChatsSearch } from "@/hooks/fetch/search-hooks/community/useChatsSearch";
import { useTeamsSearch } from "@/hooks/fetch/search-hooks/community/useUserTeamsSearch";
import { useIdentifierContext } from "@/contexts/current-user/IdentifierContext";
import UserProfileHeader from "@/components/headers/UserProfileHeader";

export default function CommunityPage({
    params: { identifier },
}: {
    params: { identifier: string };
}) {
    const itemsPerPage = 10;
    const { identifier: contextIdentifier, users, teams, isUser } = useIdentifierContext();
    const currentUserId = users?.[0]?.id;
    const enabled = !!currentUserId && isUser;

    // Fetch project and work submissions
    const discussionsData = useDiscussionsSearch({
        extraFilters: { user_id: currentUserId || "" },
        enabled: enabled,
        context: "Workspace General",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Fetch project and work issues
    const chatsData = useChatsSearch({
        extraFilters: { users: currentUserId || "" },
        enabled: enabled,
        context: "Workspace General",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    // Fetch project and work reviews
    const teamsData = useTeamsSearch({
        extraFilters: { users: currentUserId || "" },
        enabled: enabled,
        context: "Workspace General",
        page: 1,
        itemsPerPage: itemsPerPage,
        includeRefetch: true,
    });

    return (
        <div>
            <UserProfileHeader startingActiveTab="Community" />
            <div className="p-4 space-y-4 overflow-x-hidden">
                <div>
                    <div className={`flex items-center pb-4 pl-4 text-gray-900`}>
                        <FontAwesomeIcon icon={faUsers} className="mr-2 small-icon" />
                        <h3 className="text-xl font-semibold">Discussions</h3>
                    </div>
                    <CustomTable
                        columns={[
                            {
                                label: "Title",
                                accessor: (discussion) => (
                                    <Link
                                        href={`/workspace/community/discussions/${discussion.id}`}
                                        className="flex justify-center text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                    >
                                        {discussion.title}
                                    </Link>
                                ),
                            },
                            {
                                label: "Created at",
                                accessor: (discussion) => (
                                    <span className="flex justify-center">
                                        {formatDate(discussion.createdAt || "")}
                                    </span>
                                ),
                            },
                            {
                                label: "Status",
                                accessor: (discussion) => (
                                    <span className="flex justify-center">
                                        {discussion.users?.fullName}
                                    </span>
                                ),
                            },
                            {
                                label: "Content",
                                accessor: (discussion) => (
                                    <span className="flex justify-center">
                                        {truncateText(discussion.content || "", 60)}
                                    </span>
                                ),
                            },
                        ]}
                        data={discussionsData.data || []}
                        footer={
                            <div className="flex justify-center py-2">
                                <Link
                                    href={`/workspace/community/discussions`}
                                    className="flex justify-center text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    See All Discussions
                                </Link>
                            </div>
                        }
                        noDataMessage="No Project Discussions."
                    />
                </div>

                <div>
                    <div className="flex items-center pb-4 pl-4 text-gray-900">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 small-icon" />
                        <h3 className="text-xl font-semibold">Chats</h3>
                    </div>
                    <CustomTable
                        columns={[
                            {
                                label: "Title",
                                accessor: (chat) => (
                                    <Link
                                        href={`/workspace/community/chats/${chat.id}`}
                                        className="flex justify-center text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                    >
                                        {chat.title}
                                    </Link>
                                ),
                            },
                            {
                                label: "Created at",
                                accessor: (chat) => (
                                    <span className="flex justify-center">
                                        {formatDate(chat.createdAt || "")}
                                    </span>
                                ),
                            },
                            {
                                label: "Last Message",
                                accessor: (chat) => (
                                    <span className="flex justify-center">
                                        {truncateText(chat?.chatMessages?.[0]?.content || "", 100)}
                                    </span>
                                ),
                            },
                        ]}
                        data={chatsData.data || []}
                        footer={
                            <div className="flex justify-center py-2">
                                <Link
                                    href={`/workspace/community/chats`}
                                    className="flex justify-center text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    See All Chats
                                </Link>
                            </div>
                        }
                        noDataMessage="No Chats."
                    />
                </div>

                <div>
                    <div className="flex items-center pb-4 pl-4 text-gray-900">
                        <FontAwesomeIcon icon={faEdit} className="mr-2 small-icon" />
                        <h3 className="text-xl font-semibold">Teams</h3>
                    </div>
                    <CustomTable
                        columns={[
                            {
                                label: "Team Name",
                                accessor: (team) => (
                                    <Link
                                        href={`/workspace/community/teams/${team.id}`}
                                        className="flex justify-center text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                    >
                                        {team.teamName}
                                    </Link>
                                ),
                            },
                            {
                                label: "Last Modified",
                                accessor: (team) => (
                                    <span className="flex justify-center">
                                        {formatDate(team.updatedAt || "")}
                                    </span>
                                ),
                            },
                        ]}
                        data={teamsData.data || []}
                        footer={
                            <div className="flex justify-center py-2">
                                <Link
                                    href={`/workspace/community/teams`}
                                    className="text-gray-900 hover:text-blue-700 hover:underline font-semibold"
                                >
                                    See All Teams
                                </Link>
                            </div>
                        }
                        noDataMessage="No Teams."
                    />
                </div>
            </div>
        </div>
    );
}
