import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Appliance Assist. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Your trusted partner for quick and reliable appliance repairs.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
