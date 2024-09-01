import { UserIdProvider } from "@/src/contexts/current-user/UserIdContext";
import { UserSmallDataProvider } from "@/src/contexts/current-user/UserSmallData";
import { UserSettingsProvider } from "@/src/contexts/current-user/UserSettingsContext";
import { UserActionsProvider } from "@/src/contexts/current-user/UserActionsContext";
import { AuthModalProvider } from "@/src/contexts/current-user/AuthModalContext";

export default function UserProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthModalProvider>
            <UserIdProvider>
                <UserSmallDataProvider>
                    <UserSettingsProvider>
                        <UserActionsProvider>{children}</UserActionsProvider>
                    </UserSettingsProvider>
                </UserSmallDataProvider>
            </UserIdProvider>
        </AuthModalProvider>
    );
}
