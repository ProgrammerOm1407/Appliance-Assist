"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Wrench, BrainCircuit, MapPin, HelpCircle, ClipboardList } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/request-service', label: 'Request Service', icon: Wrench },
  { href: '/diagnose', label: 'Diagnose Issue', icon: BrainCircuit },
  { href: '/service-area', label: 'Service Area', icon: MapPin },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/orders', label: 'Admin', icon: ClipboardList },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          variant={pathname === href ? 'default' : 'ghost'}
          asChild
          className={cn(
            "font-medium transition-all duration-200 ease-in-out",
            pathname === href ? "bg-primary text-primary-foreground scale-105 shadow-md" : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Link href={href} className="flex items-center gap-2 px-3 py-2">
            <Icon size={18} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default Navbar;
