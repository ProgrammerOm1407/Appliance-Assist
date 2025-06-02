import { Badge } from "@/components/ui/badge";
import type { ServiceRequest } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";

interface OrderStatusBadgeProps {
  status: ServiceRequest['status'];
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "outline",
      className: "border-amber-500 text-amber-700 bg-amber-50",
      icon: Clock,
    },
    "in-progress": {
      label: "In Progress",
      variant: "default",
      className: "bg-blue-500 text-white hover:bg-blue-600",
      icon: Loader2,
    },
    completed: {
      label: "Completed",
      variant: "default",
      className: "bg-green-500 text-white hover:bg-green-600",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
      className: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant as any} className={cn("capitalize text-xs font-medium px-3 py-1 flex items-center gap-1.5 w-fit", config.className)}>
      <Icon className={cn("h-3.5 w-3.5", status === 'in-progress' && 'animate-spin')} />
      {config.label}
    </Badge>
  );
}
