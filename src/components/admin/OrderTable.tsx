"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { MoreHorizontal, Edit3, Trash2, Search, Filter as FilterIconLucide, CalendarDays, UserCircle, Phone, Mail, MapPinIcon } from 'lucide-react';
import type { ServiceRequest } from "@/lib/types";
import { getOrders, updateOrder as updateOrderInStore } from "@/lib/orderStore";
import OrderStatusBadge from "./OrderStatusBadge";
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function OrderTable() {
  const [orders, setOrders] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ServiceRequest['status'] | 'all'>('all');
  const [editingOrder, setEditingOrder] = useState<ServiceRequest | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleUpdateStatus = (orderId: string, status: ServiceRequest['status']) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (orderToUpdate) {
      const updatedOrder = { ...orderToUpdate, status };
      const updatedOrders = updateOrderInStore(updatedOrder);
      setOrders(updatedOrders);
      toast({ title: "Status Updated", description: `Order ${orderId} status set to ${status}.` });
    }
  };
  
  const handleEditNotes = (order: ServiceRequest) => {
    setEditingOrder(order);
    setNotes(order.notes || '');
  };

  const handleSaveNotes = () => {
    if (editingOrder) {
      const updatedOrder = { ...editingOrder, notes: notes };
      const updatedOrders = updateOrderInStore(updatedOrder);
      setOrders(updatedOrders);
      setEditingOrder(null);
      toast({ title: "Notes Updated", description: `Notes for order ${editingOrder.id} saved.` });
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
      .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
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
                Filter: {filterStatus === 'all' ? 'All Statuses' : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(['all', 'pending', 'in-progress', 'completed', 'cancelled'] as const).map(status => (
                <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)} className="capitalize">
                  {status === 'all' ? 'All Statuses' : status}
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
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-xs">{order.id}</TableCell>
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
                        <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(order.id, s)} disabled={order.status === s}>
                          Set as {s}
                        </DropdownMenuItem>
                      ))}
                       <DropdownMenuItem className="text-red-600" onClick={() => { /* Implement delete if needed */ alert('Delete functionality not implemented in this demo.')}}>
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
