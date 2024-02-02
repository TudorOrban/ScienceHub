"use client";

import { useUsersSmall } from "@/hooks/utils/useUsersSmall";
import { keysToCamelCase, snakeCaseToCamelCase } from "@/services/fetch/fetchGeneralData";
import { Team } from "@/types/communityTypes";
import { User, UserFullDetails } from "@/types/userTypes";
import { decodeIdentifier } from "@/utils/functions";
import supabase from "@/utils/supabase";
import React, { useContext, useEffect, useState } from "react";

export type UserField = string | string[];
export type UserProfileChanges = Record<string, UserField>;

export type IdentifierContextType = {
    identifier?: string;
    isUser?: boolean;
    users?: User[];
    teams?: Team[];
    isLoading: boolean;
    setIdentifier: (identifier: string) => void;
    setIsUser: (isUser: boolean) => void;
    setUsers: (users: User[]) => void;
    setTeams: (teams: Team[]) => void;
    setIsLoading: (isLoading: boolean) => void;
};

/**
 * Context for the [identifier] dynamic routes
 * Decoding identifier and fetching user data if necessary
 */
export const IdentifierContext = React.createContext<IdentifierContextType | undefined>(undefined);

export const useIdentifierContext = (): IdentifierContextType => {
    const context = useContext(IdentifierContext);
    if (!context) {
        throw new Error("Please use IdentifierContext within a IdentifierContextProvider");
    }
    return context;
};

export const IdentifierProvider: React.FC<{
    initialIsUser: boolean;
    initialIdentifier?: string;
    children: React.ReactNode;
}> = ({ initialIsUser, initialIdentifier, children }) => {
    const [isUser, setIsUser] = useState<boolean>(initialIsUser);
    const [identifier, setIdentifier] = useState<string>(initialIdentifier || "");
    const [users, setUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (identifier) {
            const { usersUsernames, teamsUsernames } = decodeIdentifier(identifier);

            const fetchIdentifierData = async () => {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("id, username, full_name")
                    .in("username", usersUsernames);
                const { data: teamData, error: teamError } = await supabase
                    .from("teams")
                    .select("id, team_name, team_username")
                    .in("team_username", teamsUsernames);

                if (userError) {
                    console.error(userError);
                } else {
                    setUsers(snakeCaseToCamelCase<User[]>(userData));
                }
                if (teamError) {
                    console.error(teamError);
                } else {
                    setTeams(teamData);
                }
            };

            fetchIdentifierData();
        }
    }, [identifier]);

    return (
        <IdentifierContext.Provider
            value={{
                identifier,
                setIdentifier,
                isUser,
                setIsUser,
                users,
                setUsers,
                teams,
                setTeams,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </IdentifierContext.Provider>
    );
};
