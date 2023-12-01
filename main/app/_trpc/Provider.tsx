import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "./client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
    // const [queryClient] = useState(() => new QueryClient({}));
    const queryClient = useQueryClient();
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3000/api/trpc",
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
