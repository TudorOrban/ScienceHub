import React from "react";

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="overflow-y-auto"
            style={{ height: "calc(100vh - 4rem)" }}
        >
            {children}
        </div>
    );
}
