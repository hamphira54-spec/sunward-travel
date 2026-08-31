"use client";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";

/**
 * PublicLayoutShell
 * Renders the public NavBar and Footer only on non-admin routes.
 * Admin pages (/admin/*) get a bare shell — their own isolated layout
 * in app/admin/(protected)/layout.tsx handles navigation.
 */
export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
