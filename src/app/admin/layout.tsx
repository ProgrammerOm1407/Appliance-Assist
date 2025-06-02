
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions";
import { LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
            <LayoutDashboard size={24} />
            <span className="text-xl font-headline font-bold">Admin Panel</span>
          </Link>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
