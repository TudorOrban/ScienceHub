import "./globals.css";
import "@/app/styles/buttons.scss";
import { Figtree, Roboto, Lato, Inter, Nunito_Sans } from "next/font/google";

/* 
Candidates:
1. Figtree
2. Lato
3. Nunito_Sans
3. Roboto

*/

import type { Metadata } from "next";
import * as React from "react";

import Providers from "@/providers/Providers";
import Header from "@/components/headers/Header";
import Sidebar from "@/components/complex-elements/sidebars/Sidebar";
import BrowseSidebar from "@/components/complex-elements/sidebars/BrowseSidebar";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
    title: "ScienceHub",
    description: "Open forum for Science",
};

// export const revalidate = 0;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
