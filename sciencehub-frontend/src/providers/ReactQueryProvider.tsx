
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export default function ReactQueryProvider ({ children }: {children: React.ReactNode }) {
    const [client] = React.useState(new QueryClient());

    return (
        <QueryClientProvider client={client}>
            {/* <ReactQueryStreamedHydration> */}
                {children}
            {/* </ReactQueryStreamedHydration> */}
        </QueryClientProvider>
    )
}