import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactWidget } from "@/components/site/WhatsAppFloat";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-3">404</div>
        <h1 className="font-display text-4xl text-ink">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-ink mt-8 inline-flex">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-outline-ink">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sunglass Manufacturer | OEM & Private Label Sunglasses" },
      { name: "description", content: "Leading Sunglass Manufacturer offering OEM, private label and wholesale sunglasses with custom branding, low MOQ, premium quality and worldwide shipping." },
      { name: "author", content: "OEMSunglasses.com" },
      { name: "keywords", content: "OEM sunglasses, private label sunglasses, wholesale sunglasses, custom logo sunglasses, sunglasses manufacturer India, bulk sunglasses supplier, promotional sunglasses" },
      { property: "og:site_name", content: "OEMSunglasses.com" },
      { property: "og:title", content: "Sunglass Manufacturer | OEM & Private Label Sunglasses" },
      { property: "og:description", content: "Leading Sunglass Manufacturer offering OEM, private label and wholesale sunglasses with custom branding, low MOQ, premium quality and worldwide shipping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sunglass Manufacturer | OEM & Private Label Sunglasses" },
      { name: "twitter:description", content: "Leading Sunglass Manufacturer offering OEM, private label and wholesale sunglasses with custom branding, low MOQ, premium quality and worldwide shipping." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/FjtihbaOMSeVaGghoWhWJi8EXpy1/social-images/social-1783271389442-ChatGPT_Image_Jul_5,_2026,_09_50_21_PM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/FjtihbaOMSeVaGghoWhWJi8EXpy1/social-images/social-1783271389442-ChatGPT_Image_Jul_5,_2026,_09_50_21_PM.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "OEMSunglasses.com",
          url: "/",
          description: "OEM sunglasses manufacturer, private label & wholesale supplier in India.",
          sameAs: [],
        }),
      },
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-CZ02VNW4T9",
      },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CZ02VNW4T9');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <DialogsProvider>
        <div className="flex min-h-screen flex-col pb-20 md:pb-0">
          <Header />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
        <ContactWidget />
        <StickyMobileCTA />
      </DialogsProvider>
    </QueryClientProvider>
  );
}
