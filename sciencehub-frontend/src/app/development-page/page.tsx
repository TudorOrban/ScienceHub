"use client";

import UsersSelection from "@/src/components/complex-elements/selections/UsersSelection";
import { User } from "@/src/types/userTypes";
import { useState } from "react";

/**
 * Development page for testing components.
 * 
 */
export default function DevelopmentPage() {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    
    return (
        <div>
            <UsersSelection selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
        </div>
    )
}