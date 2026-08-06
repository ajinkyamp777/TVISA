import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import Providers from '@/providers/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import { Toaster } from 'react-hot-toast';

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    style: ['normal', 'italic'],
    variable: '--font-cormorant',
    display: 'swap',
});

const jost = Jost({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-jost',
    display: 'swap',
});

export const metadata = {
    title: 'Tvisaa - For You',
    description: 'Discover BIS hallmarked fine jewelry. Handcrafted rings, necklaces, bangles, earrings & bracelets in gold, diamond & silver. Free shipping on all orders.',
    keywords: 'jewelry, gold, diamond, silver, rings, necklaces, bangles, earrings, bracelets, BIS hallmarked',
    openGraph: {
        title: 'Tvisaa - For You',
        description: 'Discover BIS hallmarked fine jewelry with free shipping on all orders.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
            <head>
                <link rel="icon" href="/images/logo.png" />
            </head>
            <body className="font-jost bg-petal text-noir antialiased">
                <Providers>
                    {/* <AnnouncementBar /> */}
                    <Navbar />
                    <main className="min-h-screen pt-16 lg:pt-24">{children}</main>
                    <Footer />
                    <FloatingWhatsApp />
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1A0A10',
                                color: '#FAF0F3',
                                fontFamily: 'var(--font-jost)',
                            },
                            success: { iconTheme: { primary: '#C9A86C', secondary: '#1A0A10' } },
                            error: { iconTheme: { primary: '#8B1D52', secondary: '#FAF0F3' } },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
