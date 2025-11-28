import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast-context";
import { ErrorBoundaryWrapper } from "@/components/shared/ErrorBoundaryWrapper";
import { PWARegistration } from "@/components/PWARegistration";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { MedicalOrganizationSchema } from "@/components/seo/MedicalOrganizationSchema";
import { WebsiteSchema } from "@/components/seo/WebsiteSchema";
import { MockApiProvider } from "./MockApiProvider";

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Mutqin | منصة التعليم الطبي المستمر في السعودية",
        template: "%s | Mutqin",
    },
    description: "المنصة الموحدة للتعليم الطبي المستمر المعتمد. The unified platform for continuing medical education in Saudi Arabia. مُوَحَّد. مُوثَّق. مُتاح.",
    keywords: ["CME", "Continuing Medical Education", "Saudi Arabia", "SCFHS", "Medical Training", "مُتْقِن", "التعليم الطبي المستمر", "الهيئة السعودية للتخصصات الصحية"],
    authors: [{ name: "Mutqin" }],
    creator: "Mutqin",
    publisher: "Mutqin",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mutqin.sa"),
    alternates: {
        canonical: "/",
        languages: {
            "ar": "/ar",
            "en": "/en",
        },
    },
    openGraph: {
        type: "website",
        locale: "ar_SA",
        alternateLocale: ["en_US"],
        siteName: "Mutqin",
        title: "Mutqin | منصة التعليم الطبي المستمر",
        description: "المنصة الموحدة للتعليم الطبي المستمر المعتمد في المملكة العربية السعودية",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Mutqin - منصة التعليم الطبي المستمر",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mutqin | منصة التعليم الطبي المستمر",
        description: "المنصة الموحدة للتعليم الطبي المستمر المعتمد",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Mutqin",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#007AFF",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <head>
                <OrganizationSchema />
                <MedicalOrganizationSchema />
                <WebsiteSchema />
            </head>
            <body
                className={`${cairo.variable} font-sans antialiased bg-[var(--system-background)] text-[var(--label)] transition-colors duration-300`}
            >
                <ErrorBoundaryWrapper>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <LanguageProvider>
                            <AuthProvider>
                                <PersonaProvider>
                                    <ToastProvider>
                                        <MockApiProvider />
                                        <PWARegistration />
                                        {children}
                                    </ToastProvider>
                                </PersonaProvider>
                            </AuthProvider>
                        </LanguageProvider>
                    </ThemeProvider>
                </ErrorBoundaryWrapper>
            </body>
        </html>
    );
}
