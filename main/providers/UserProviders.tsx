import { UserIdProvider } from "@/contexts/current-user/UserIdContext";
import UserProvider from "./UserProvider";
import { UserSmallDataProvider } from "@/contexts/current-user/UserSmallData";
import { UserSettingsProvider } from "@/contexts/current-user/UserSettingsContext";
import { UserActionsProvider } from "@/contexts/current-user/UserActionsContext";

export default function UserProviders({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <UserIdProvider>
                <UserSmallDataProvider>
                    <UserSettingsProvider>
                        <UserActionsProvider>{children}</UserActionsProvider>
                    </UserSettingsProvider>
                </UserSmallDataProvider>
            </UserIdProvider>
        </UserProvider>
    );
}
