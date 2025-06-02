import Link from 'next/link';
import { Wrench } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Wrench size={32} strokeWidth={2.5} />
      <span className="text-3xl font-headline font-bold">Appliance Assist</span>
    </Link>
  );
};

export default Logo;
