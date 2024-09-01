import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChatMessages } from "@/src/services/fetch/community/fetchChatMessages";

export const useChatMessages = (chatId: number, itemsPerPage: number, enabled?: boolean) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["chatMessages", chatId],
        queryFn: ({ pageParam = 0 }) => fetchChatMessages(chatId, pageParam, itemsPerPage),
        getNextPageParam: (lastPage, allPages) => {
            const morePagesExist = lastPage?.length === itemsPerPage;
            if (morePagesExist) {
                return allPages.length;
            }
            return undefined;
        }
    })

    return { data, fetchNextPage, hasNextPage };
}