"use client";

import UsersSelection from "@/components/complex-elements/selections/UsersSelection";
import { User } from "@/types/userTypes";
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