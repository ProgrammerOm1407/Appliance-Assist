export type ApplianceType = "fridge" | "washing-machine" | "filter" | "oven" | "dishwasher" | "other";

export const applianceTypes: ApplianceType[] = ["fridge", "washing-machine", "filter", "oven", "dishwasher", "other"];

export interface ServiceRequest {
  id: string;
  applianceType: ApplianceType;
  issueDescription: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string; // Store as ISO string for easier localStorage/JSON handling
  updatedAt: string;
  notes?: string; // Admin notes
}
