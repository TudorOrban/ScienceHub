"use client";

import { useState } from "react";
import { useChatData } from "@/app/hooks/fetch/data-hooks/community/useChatMessages";
import ChatUI from "@/components/cards/community/ChatUI";
import { useUserId } from "@/app/contexts/general/UserIdContext";
import { OwnershipResult } from "@/utils/identifyOwnership";

// // app/[identifier]/[projectId]/page.tsx
//
// export async function generateStaticParams() {
//     // Example arrays, replace these with actual fetched identifiers and projectIds
//     const identifiers = ['user1', 'team1'];
//     const projectIds = ['proj1', 'proj2'];

//     // Generate combinations of identifiers and projectIds
//     return identifiers.flatMap(identifier =>
//       projectIds.map(projectId => ({ identifier, projectId }))
//     );
//   }

interface IssuePageProps {
    params: {
        identifier: string;
        projectId: string;
    };
    data: any;
}

export default function IssuePage({ params }: { params: { chatId: string } }) {
    const { chatId } = params;

    const [identifierInfo, setIdentifierInfo] =
        useState<OwnershipResult | null>(null);

    const userId = useUserId();
    const effectiveUserId = userId || "794f5523-2fa2-4e22-9f2f-8234ac15829a";

    const chatData = useChatData(
        chatId.toString(),
        true
    );
    console.log("CHat data: ", chatData);

    if (!chatData) {
        return <div>No project data</div>;
    }

    return (
        <div className="h-full">
            <ChatUI chatData={chatData.data[0] || {}} currentUserID={effectiveUserId} />
        </div>
    );
}
