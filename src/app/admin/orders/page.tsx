import OrderTable from '@/components/admin/OrderTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <ClipboardList className="h-10 w-10 text-primary" />
          Order Management
        </h1>
        <p className="text-muted-foreground font-body">View, track, and update service requests.</p>
      </header>
      <OrderTable />
    </div>
  );
}
