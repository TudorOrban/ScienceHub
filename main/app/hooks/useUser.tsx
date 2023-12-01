import { Subscription, UserDetails } from "@/types/userTypes";
import { User } from "@supabase/auth-helpers-nextjs";
import { 
    useSessionContext,
    useUser as useSupaUser 
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();

    const user = useSupaUser() as User;

    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetails = () => supabase.from('users').select('*').limit(1);
    const getSubscription = () =>
        supabase 
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            .limit(1);

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);

            Promise.allSettled([getUserDetails(), getSubscription()]).then(results => {
                const userDetailsResult = results[0];
                const subscriptionResult = results[1];
            
                if (userDetailsResult.status === "fulfilled" && userDetailsResult.value.data) {
                    const userDetailsData = userDetailsResult.value.data;
                    if (Array.isArray(userDetailsData) && userDetailsData.length > 0) {
                        setUserDetails(userDetailsData[0] as UserDetails);
                    }
                }
            
                if (subscriptionResult.status === "fulfilled" && subscriptionResult.value.data) {
                    const subscriptionData = subscriptionResult.value.data;
                    if (Array.isArray(subscriptionData) && subscriptionData.length > 0) {
                        setSubscription(subscriptionData[0] as Subscription);
                    }
                }
            
                setIsLoadingData(false);
            });
            
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }

    return context; 
}