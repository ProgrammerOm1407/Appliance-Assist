
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { MoreHorizontal, Edit3, Trash2, Search, Filter as FilterIconLucide, CalendarDays, UserCircle, Phone, Mail, MapPinIcon, Loader2 as SpinnerIcon } from 'lucide-react';
import type { ServiceRequest } from "@/lib/types";
import { getServiceRequests, updateServiceRequest } from "@/lib/firebaseOrdersService"; // Updated import
import OrderStatusBadge from "./OrderStatusBadge";
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderTable() {
  const [orders, setOrders] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ServiceRequest['status'] | 'all'>('all');
  const [editingOrder, setEditingOrder] = useState<ServiceRequest | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getServiceRequests();
      setOrders(fetchedOrders);
    } catch (error) {
      toast({
        title: "Error Fetching Orders",
        description: "Could not load service requests from the database.",
        variant: "destructive",
      });
      setOrders([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, status: ServiceRequest['status']) => {
    try {
      await updateServiceRequest(orderId, { status });
      toast({ title: "Status Updated", description: `Order ${orderId.substring(0,7)} status set to ${status}.` });
      fetchOrders(); // Re-fetch orders to reflect changes
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update order status.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditNotes = (order: ServiceRequest) => {
    setEditingOrder(order);
    setNotes(order.notes || '');
  };

  const handleSaveNotes = async () => {
    if (editingOrder) {
      try {
        await updateServiceRequest(editingOrder.id, { notes });
        toast({ title: "Notes Updated", description: `Notes for order ${editingOrder.id.substring(0,7)} saved.` });
        setEditingOrder(null);
        fetchOrders(); // Re-fetch orders
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Could not save notes.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => 
        (filterStatus === 'all' || order.status === filterStatus) &&
        (order.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.applianceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      // Sorting is already handled by Firestore query, but can be kept if client-side sorting is preferred after fetch
      // .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()); 
  }, [orders, searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIconLucide className="h-5 w-5 text-muted-foreground" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="capitalize w-full sm:w-auto">
                Filter: {filterStatus === 'all' ? 'All Statuses' : filterStatus.replace('-', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(['all', 'pending', 'in-progress', 'completed', 'cancelled'] as const).map(status => (
                <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)} className="capitalize">
                  {status === 'all' ? 'All Statuses' : status.replace('-', ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Appliance</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /><Skeleton className="h-3 w-[150px] mt-1" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-xs">{order.id.substring(0,7)}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.contactName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={12}/> {order.contactEmail}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={12}/> {order.contactPhone}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPinIcon size={12}/> {order.address}</div>
                </TableCell>
                <TableCell className="capitalize">{order.applianceType.replace('-', ' ')}</TableCell>
                <TableCell className="max-w-xs truncate text-sm">{order.issueDescription}</TableCell>
                <TableCell>
                  <div className="text-sm">{format(parseISO(order.createdAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-muted-foreground">{format(parseISO(order.createdAt), 'p')}</div>
                  </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditNotes(order)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Notes
                      </DropdownMenuItem>
                      {(['pending', 'in-progress', 'completed', 'cancelled'] as const).map(s => (
                        <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(order.id, s)} disabled={order.status === s} className="capitalize">
                          Set as {s.replace('-', ' ')}
                        </DropdownMenuItem>
                      ))}
                       <DropdownMenuItem className="text-red-600" onClick={() => { /* Implement delete if needed with Firestore */ alert('Delete functionality requires Firestore integration.')}}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete (Demo)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingOrder && (
        <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Notes for Order #{editingOrder.id.substring(0,7)}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this order..."
                rows={5}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setEditingOrder(null)}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
