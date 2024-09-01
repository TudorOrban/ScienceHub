import React from "react";

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main>{children}</main>;
}
