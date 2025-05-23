import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/context/ReactQueryContext";
import {Sidebar} from "@/components/Sidebar";
import {Toaster} from "@/components/ui/sonner"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Manufacturing Order Management",
    description: "Back-office dashboard for manufacturing order management",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ReactQueryProvider>
            <div className="flex h-screen overflow-hidden">
                <Sidebar/>
                <main className="flex-1 overflow-y-auto bg-background p-6">

                    {children}
                </main>
            </div>
        </ReactQueryProvider>
        <Toaster/>
        </body>
        </html>
    );
}
