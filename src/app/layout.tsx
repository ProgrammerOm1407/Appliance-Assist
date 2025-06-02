
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Appliance Assist',
  description: 'Your trusted partner for appliance repair services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const HIDE_GLOBAL_LAYOUT_PATHS = ['/admin', '/login'];
  
  // Reading cookies in a Server Component to determine layout parts
  // Note: This approach to conditionally render layout based on path for admin/login
  // is not ideal directly in RootLayout if `pathname` is needed, as `usePathname` is client-side.
  // For this prototype, we'll assume middleware handles redirection correctly,
  // and the admin section has its own layout.
  // A more robust way for conditional global layout parts would involve more complex component structures
  // or passing path information down. For now, the admin layout handles its own header/footer.

  const cookieStore = cookies();
  const isAdminSession = cookieStore.has(SESSION_COOKIE_NAME);

  // This example doesn't directly use isAdminSession to change layout here,
  // as admin routes now have their own AdminLayout.
  // The global Header and Footer will appear on non-admin, non-login pages.

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {/*
          We need a way to conditionally render Header/Footer based on the route.
          The middleware handles access, but layout structure is decided here.
          A simple way is to have specific layouts for /admin and /login that don't include global Header/Footer.
          The AdminLayout already does this for /admin. The /login page will be standalone.
          So, for children that are NOT admin or login, they get Header/Footer.
          This logic is tricky in RootLayout without client-side path checks.
          The current structure relies on /admin having its own full layout, and /login being simple.
        */}
        
        {/* A more explicit check for paths would be needed if Header/Footer should be hidden for /login too */}
        {/* For now, /login will inherit Header/Footer unless it also gets its own dedicated layout */}
        {/* This is a simplification. If /login needs no Header/Footer, it needs its own simple layout. */}

        {/* Let's assume children will be wrapped by specific layouts if they shouldn't have global H/F */}
        <Header /> 
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

