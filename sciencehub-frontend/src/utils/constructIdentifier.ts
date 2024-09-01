import { Team } from "@/src/types/communityTypes";
import { User } from "@/src/types/userTypes";

/**
 * Util for constructing identifier from user and team names
 */
export const constructIdentifier = (users: User[], teams: Team[]) => {
    const userUsernames = users.map((user) => user.username);
    const teamUsernames = teams.map((team) => team.teamUsername);

    if (teamUsernames.length > 0) {
        teamUsernames[0] = `T~${teamUsernames[0]}`;
    }
    return [...userUsernames, ...teamUsernames].join("~");
};
