import { Database } from "@/types_db";
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type OwnershipType = "user" | "team" | "multipleUsers" | "multipleTeams" | "mixed" | "unknown";

export interface OwnershipResult {
  type: OwnershipType;
  ids: string[];
}

export async function identifyOwnership(
    supabase: SupabaseClient<Database>,
    identifier: string
  ): Promise<OwnershipResult> {
    const names = decodeURIComponent(identifier).split("~");
  
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("username")
      .in("username", names);
  
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("team_name")
      .in("team_name", names);

  if (usersError || teamsError) {
    
    throw new Error(`Batch query error: ${usersError || teamsError}`);
  }

  const identifiedUserIds: string[] = usersData ? usersData.map(user => user.username || "") : [];
  const identifiedTeamIds: string[] = teamsData ? teamsData.map(team => team.team_name || "") : [];

  let type: OwnershipType = "unknown";

  if (identifiedUserIds.length && identifiedTeamIds.length) {
    type = "mixed";
} else if (identifiedUserIds.length) {
    type = identifiedUserIds.length > 1 ? "multipleUsers" : "user";
} else if (identifiedTeamIds.length) {
    type = "team";
}


  return {
    type,
    ids: [...identifiedUserIds, ...identifiedTeamIds],
  };
}
