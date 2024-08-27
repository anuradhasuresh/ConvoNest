import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import React from "react"

import '../globals.css'

// useful for SEO
export const metadeta = {
    title: 'ConvoNest',
    description: 'A Next.js 13 Meta Threads clone app'
};

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ 
    children 
}: { 
    children: React.ReactNode 

}) {
    return (
    <ClerkProvider>
        <html lang= "en">
            <body className={ '${inter.className} bg-dark-1' }>
                <div className="w-full flex justify-center items-center min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    </ClerkProvider>
    )
}