import { UserIdProvider } from "@/contexts/current-user/UserIdContext";
import { UserSmallDataProvider } from "@/contexts/current-user/UserSmallData";
import { UserSettingsProvider } from "@/contexts/current-user/UserSettingsContext";
import { UserActionsProvider } from "@/contexts/current-user/UserActionsContext";
import { AuthModalProvider } from "@/contexts/current-user/AuthModalContext";

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
