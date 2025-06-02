// src/lib/actions.ts
"use server";

import { z } from "zod";
import { diagnoseIssue as genAiDiagnoseIssue, DiagnoseIssueInput } from "@/ai/flows/diagnose-issue";
import type { ServiceRequest, ApplianceType } from "./types";

const serviceRequestSchema = z.object({
  applianceType: z.custom<ApplianceType>(),
  issueDescription: z.string().min(10, "Issue description must be at least 10 characters."),
  contactName: z.string().min(2, "Name is required."),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address is required."),
});

export type ServiceRequestFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
  orderId?: string;
};

// This function is a placeholder. In a real app, it would interact with a database.
// For this demo, it just structures the data. The actual saving to localStorage
// will happen on the client-side after the server action returns.
export async function submitServiceRequestAction(
  prevState: ServiceRequestFormState,
  formData: FormData
): Promise<ServiceRequestFormState> {
  const rawFormData = Object.fromEntries(formData);
  const parseResult = serviceRequestSchema.safeParse(rawFormData);

  if (!parseResult.success) {
    return {
      message: "Invalid form data.",
      issues: parseResult.error.issues.map((issue) => issue.path.join('.') + ': ' + issue.message),
      success: false,
    };
  }

  const data = parseResult.data;
  
  // Simulate saving to a database and getting an ID
  // The actual order object to be saved in localStorage will be constructed on the client.
  // This action primarily validates and confirms submission.
  const orderId = Math.random().toString(36).substr(2, 9);

  console.log("Service Request Submitted (Server Action):", data);

  return {
    message: "Service request submitted successfully!",
    success: true,
    orderId: orderId, // Pass a conceptual ID
    // We pass back the data so client can store it
    fields: { ...data, id: orderId, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any,
  };
}


const diagnosisSchema = z.object({
  applianceType: z.custom<ApplianceType>(),
  issueDescription: z.string().min(10, "Issue description must be at least 10 characters."),
});

export type DiagnosisFormState = {
  message: string;
  issues?: string[];
  diagnosis?: {
    possibleCauses: string[];
    confidenceLevel: string;
  };
  success: boolean;
};

export async function diagnoseIssueAction(
  prevState: DiagnosisFormState,
  formData: FormData
): Promise<DiagnosisFormState> {
  const rawFormData = Object.fromEntries(formData);
  const parseResult = diagnosisSchema.safeParse(rawFormData);

  if (!parseResult.success) {
    return {
      message: "Invalid form data.",
      issues: parseResult.error.issues.map((issue) => issue.path.join('.') + ': ' + issue.message),
      success: false,
    };
  }

  const { applianceType, issueDescription } = parseResult.data;

  try {
    const diagnosisResult = await genAiDiagnoseIssue({ 
      applianceType: applianceType as string, // Cast as AI flow expects generic string
      issueDescription 
    });
    return {
      message: "Diagnosis complete.",
      diagnosis: diagnosisResult,
      success: true,
    };
  } catch (error) {
    console.error("Error during AI diagnosis:", error);
    return {
      message: "Failed to get diagnosis. Please try again.",
      success: false,
    };
  }
}
