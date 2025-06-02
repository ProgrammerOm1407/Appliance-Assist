import Link from 'next/link';
import Navbar from './Navbar';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Logo />
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
