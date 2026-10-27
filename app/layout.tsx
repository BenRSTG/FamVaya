import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { VisitorTracker } from "@/components/visitor-tracker";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { CompareProvider } from "@/components/compare/compare-context";
import { CompareTray } from "@/components/compare/compare-tray";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { getSiteUrl } from "@/lib/site-url";
import { getConsent } from "@/lib/consent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "Familienunterkünfte, Ausflüge, Mikro-Abenteuer und Tipps für Familien mit drei oder mehr Kindern – ehrlich geprüft, mit Gesamtpreisen und klaren Hinweisen.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "FamVaya – Familienurlaub & Ausflüge mit 3+ Kindern",
    template: "%s | FamVaya",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: "FamVaya",
    type: "website",
    locale: "de_DE",
    title: "FamVaya – Familienurlaub & Ausflüge mit 3+ Kindern",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/hero-familie-berge.jpg", alt: "Familie wandert in den Bergen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FamVaya – Familienurlaub & Ausflüge mit 3+ Kindern",
    description: SITE_DESCRIPTION,
    images: ["/images/hero-familie-berge.jpg"],
  },
  // Search Console / Bing Webmaster: Code per Umgebungsvariable, kein Eintrag nötig,
  // wenn die Domain per DNS bestätigt wurde.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FamVaya",
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/brand/famvaya-logo.svg`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FamVaya",
  url: getSiteUrl(),
  potentialAction: {
    "@type": "SearchAction",
    target: `${getSiteUrl()}/suche?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const consent = await getConsent();

  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Zum Inhalt springen
        </a>
        <CompareProvider>
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <SiteFooter />
          <CompareTray />
        </CompareProvider>
        <ScrollToTopButton />
        <CookieConsentBanner key={consent ?? "unset"} initialConsent={consent} />
        {consent === "accepted" && (
          <>
            <Analytics />
            <Suspense fallback={null}>
              <VisitorTracker />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
