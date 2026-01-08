import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 60 * 12, // 12 hours
            retry: false,
        },
    },
});

export default queryClient;