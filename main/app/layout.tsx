import "./globals.css";
import "@/styles/buttons.scss";
import { Inter, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import * as React from "react";
import Providers from "@/providers/Providers";
import Header from "@/components/headers/Header";
import Sidebar from "@/components/complex-elements/sidebars/Sidebar";
import BrowseSidebar from "@/components/complex-elements/sidebars/BrowseSidebar";

// Candidates: Source_Sans_3, Inter, Figtree, Open_Sans,
const font = Inter({
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    generator: "Next.js",
    applicationName: "Sciencehub",
    referrer: "origin-when-cross-origin",
    keywords: ["Scientific Research", "Community-driven", "Open source", "Collaboration"],
    authors: [{ name: "Tudor Andrei Orban", url: "https://TudorAOrban.com" }],
    creator: "Tudor Andrei Orban",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    title: {
        template: "%s | ScienceHub",
        default: "ScienceHub",
    },
    description:
        "An open-source, non-profit, community-driven platform aiming to provide comprehensive software solutions for facilitating the scientific process.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={font.className}>
            <body>
                <Providers>
                    <div className="flex flex-col h-screen w-full">
                        <div className="h-16">
                            <Header />
                        </div>
                        <div className="flex flex-row flex-grow overflow-hidden">
                            {/* Sidebar */}
                            <div
                                className="fixed inset-y-0 left-0 z-50 md:static md:flex-none bg-white"
                                style={{
                                    height: "calc(100vh - 4rem)",
                                    top: "4rem",
                                }}
                            >
                                <Sidebar />
                                <BrowseSidebar />
                            </div>

                            {/* Main content */}
                            <div
                                className="flex-grow overflow-y-auto overflow-x-none ml-12 md:ml-0 relative"
                                style={{ height: "calc(100vh - 4rem)" }}
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
