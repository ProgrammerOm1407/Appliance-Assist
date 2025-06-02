import OrderTable from '@/components/admin/OrderTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold flex items-center gap-2 sm:gap-3">
          <ClipboardList className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
          Order Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-body">View, track, and update service requests.</p>
      </header>
      <OrderTable />
    </div>
  );
}