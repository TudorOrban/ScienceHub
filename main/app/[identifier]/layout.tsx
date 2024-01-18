import { fetchIdByUsername } from "@/services/utils/fetchIdByUsername";
import { UserDataProvider } from "@/contexts/current-user/UserDataContext";
import { ProjectGeneralSearchProvider } from "@/contexts/search-contexts/ProjectGeneralContext";
import supabase from "@/utils/supabase";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import { UserFullDetails } from "@/types/userTypes";
import UserProfileHeader from "@/components/headers/UserProfileHeader";
import { IdentifierProvider } from "@/contexts/current-user/IdentifierContext";

export default async function IdentifierLayout({
    children,
    params: { identifier },
}: {
    children: React.ReactNode;
    params: {
        identifier: string;
    };
}) {
    // Split by concatenation symbol ~
    const decodedIdentifier = identifier.split("~");
    // Check if individual user (T is reserved for marking team)
    const isPotentialUser = decodedIdentifier.length === 1 && decodedIdentifier[0] !== "T";

    const defaultDetails: UserFullDetails = {
        id: "",
        fullName: "",
        username: "",
    };
    let userDetails: UserFullDetails = defaultDetails;
    let isValidUser: boolean = false;
    let isLoading: boolean = false;

    if (isPotentialUser) {
        const userId = await fetchIdByUsername(supabase, decodedIdentifier[0]);
        isValidUser = userId !== null && userId !== undefined && userId !== "";

        if (!!userId) {
            // Actual user, fetch user details
            // TODO: Implement RLS or in-app logic for handling private profile
            const userData = await fetchGeneralData<UserFullDetails>(supabase, {
                tableName: "users",
                categories: [],
                options: {
                    tableRowsIds: [userId],
                },
            });

            if (userData) {
                userDetails = userData.data[0];
            }
        }
    }

    return (
        <IdentifierProvider initialIdentifier={identifier} initialIsUser={isValidUser} >
            <UserDataProvider
                initialUserDetails={userDetails}
                initialIsUser={isValidUser}
                initialIdentifier={identifier}
            >
                {children}
            </UserDataProvider>
        </IdentifierProvider>
    );
}
