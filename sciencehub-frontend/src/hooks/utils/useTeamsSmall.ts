import { Team } from "@/src/types/communityTypes";
import { useGeneralData } from "../fetch/useGeneralData";

export const useTeamsSmall = (teamsIds: (string | number)[], enabled?: boolean) => {
    const teamsData = useGeneralData<Team>({
        fetchGeneralDataParams: {
            tableName: "teams",
            categories: [],
            withCounts: true,
            options: {
                tableRowsIds: teamsIds,
                page: 1,
                itemsPerPage: 100,
            },
        },
        reactQueryOptions: {
            enabled: enabled,
        },
    });
    return teamsData;
};
