"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, SupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

import { Database } from "@/types_db";
import React from "react";

interface SupabaseProviderProps {
    children: React.ReactNode;
};

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children
}) => {
    const [supabaseClient] = useState(() => 
        createClientComponentClient<Database>()
    );

    return(
        <SupabaseClientContext.Provider value={supabaseClient}>
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
        </SupabaseClientContext.Provider>
    )

}
export const SupabaseClientContext = React.createContext<SupabaseClient<Database> | null>(null);


export default SupabaseProvider;