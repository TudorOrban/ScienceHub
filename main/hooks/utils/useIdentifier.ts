"use client";

import { useEffect, useState } from "react";
import { useTeamsSmall } from "./useTeamsSmall";
import { useUsersSmall } from "./useUsersSmall";

const useIdentifier = (userIds: (string | number)[], teamIds: (string | number)[]) => {
    const [identifier, setIdentifier] = useState<string | null>(null);

    const usersData = useUsersSmall(userIds, true);
    const teamsData = useTeamsSmall(teamIds, true);

    useEffect(() => {
        if (
            usersData !== null &&
            teamsData !== null &&
            !usersData.serviceError &&
            !teamsData.serviceError
        ) {
            const usernames =
                userIds.length > 0
                    ? ((usersData?.data || [])
                          .map((user) => user.username)
                          .filter(Boolean) as string[])
                    : [];
            const teamnames =
                teamIds.length > 0
                    ? ((teamsData?.data || [])
                          .map((team) => team.teamName)
                          .filter(Boolean) as string[])
                    : [];

            if (teamnames.length > 0) {
                teamnames[0] = `T~${teamnames[0]}`;
            }
            setIdentifier([...usernames, ...teamnames].join("~"));
        }
    }, [usersData, teamsData]);
    const isLoading = usersData.isLoading || teamsData.isLoading;
    const error = usersData.serviceError || teamsData.serviceError;

    return { identifier, error, isLoading };
};

export default useIdentifier;
