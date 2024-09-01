import { Team } from "@/src/types/communityTypes";
import { Database } from "@/types_db";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

type ObjectTeams = {
    objectId: string;
    teams: Team[];
};

type FetchObjectTeamsOptions = {
    objectIds: string[];
    tableName: string;
};

export const fetchTableTeams = async (
    supabase: SupabaseClient<Database>,
    options: FetchObjectTeamsOptions
): Promise<ObjectTeams[]> => {
    const { objectIds, tableName } = options;
    const tableNameId = `${tableName}_id`;
    const tableTeamId = 'team_id';
    
    const objectTeamsResponse = await supabase
        .from(`${tableName}_teams`)
        .select(`${tableNameId}, ${tableTeamId}`)
        .in(tableNameId, objectIds);

    if (objectTeamsResponse.error) {
        throw objectTeamsResponse.error;
    }

    const objectIdToTeamIdsMap: Record<string, string[]> = {};
    for (const row of objectTeamsResponse.data) {
        if (!objectIdToTeamIdsMap[row[tableNameId as keyof typeof row] as string]) {
            objectIdToTeamIdsMap[row[tableNameId as keyof typeof row] as string] = [];

        }
        objectIdToTeamIdsMap[row[tableNameId as keyof typeof row] as string].push(row[tableTeamId as keyof typeof row] as string);
    }

    const allTeamIds = Object.values(objectIdToTeamIdsMap).flat();
    const teamsResponse = await supabase
        .from("teams")
        .select("id, team_username, team_name")
        .in("id", allTeamIds);

    if (teamsResponse.error) {
        throw teamsResponse.error;
    }

    const finalData: ObjectTeams[] = objectIds.map((objectId) => {
        const teamIds = objectIdToTeamIdsMap[objectId] || [];
        const teams = teamsResponse.data
            .filter((team) => teamIds.includes(team.id))
            .map((team) => ({
                id: team.id,
                teamUsername: team.team_username || "Unknown",
                teamName: team.team_name || "Unknown",
            }));

        return {
            objectId,
            teams,
        };
    });

    return finalData;
};

 