import { useTableUsers } from "@/src/hooks/utils/useTableUsers";
import React from "react";
import { HookResult } from "../useGeneralData";

type ObjectsWithUsersParams<T> = {
    objectsData: HookResult<T>;
    tableName: string;
    // activeTab: string;
    enabled: boolean;
};

/**
 * Util hook for fetching an object's users (and teams, to be used soon).
 * Needed when filtering a search by a user's id (eg. in Workspace pages).
 */
export const useObjectsWithUsers = <T>({
    objectsData,
    tableName,
    enabled,
}: ObjectsWithUsersParams<T>): HookResult<T> => {
    const objectsIds = objectsData.data.map((object) => (object as any).id);
    const {
        data: objectsUsers,
        error: objectsUsersError,
        isLoading: objectsUsersLoading,
    } = useTableUsers({
        objectIds: objectsIds,
        tableName: tableName,
        enabled: enabled,
    });

    // Merge project users and teams
    const mergedObjects = React.useMemo(() => {
        if (!objectsData || !objectsUsers) return [];

        return objectsData.data.map((object) => {
            const matchingUsersData = objectsUsers.find(
                (objectUser) => objectUser.objectId === (object as any).id
            );
            // const matchingTeamsData = projectTeams.find(
            //     (projectTeam) => projectTeam.objectId === experiment.id.toString()
            // );

            const allUsers = matchingUsersData ? matchingUsersData.users : [];
            // const allTeams = matchingTeamsData ? matchingTeamsData.teams : [];

            return {
                ...object,
                users: allUsers,
                // teams: allTeams,
            };
        });
    }, [objectsData, objectsUsers]);

    const fetchResult: HookResult<T> = {
        data: mergedObjects,
        totalCount: objectsData.totalCount,
        isLoading: objectsData.isLoading || objectsUsersLoading, // Extend loading to include this hook's time
        status: objectsData.status,
        serviceError: objectsData.serviceError,
        hookError: objectsData.hookError,
        refetch: objectsData.refetch,
    };
    return fetchResult;
};
