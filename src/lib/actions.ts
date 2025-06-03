
// src/lib/actions.ts
"use server";

import { z } from "zod";
import { diagnoseIssue as genAiDiagnoseIssue } from "@/ai/flows/diagnose-issue";
import type { ServiceRequest, ApplianceType } from "./types";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME } from "./constants";
import { addServiceRequest as addServiceRequestToFirestore, type NewServiceRequestData } from './firebaseOrdersService';

// --- Service Request Actions ---
const serviceRequestSchema = z.object({
  applianceType: z.custom<ApplianceType>((val) => val !== undefined, "Please select an appliance type."),
  issueDescription: z.string().min(10, "Issue description must be at least 10 characters."),
  contactName: z.string().min(2, "Name is required."),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address is required."),
});

export type ServiceRequestFormState = {
  message: string;
  fields?: Record<string, string>; // Keep for potential RHF reset or display if needed, but Firestore ID is main outcome
  issues?: string[];
  success: boolean;
  orderId?: string; // Firestore document ID
};

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

  const data = parseResult.data as NewServiceRequestData;

  try {
    const newOrderId = await addServiceRequestToFirestore(data);
    console.log("Service Request Submitted to Firestore. ID:", newOrderId);

    return {
      message: "Service request submitted successfully!",
      success: true,
      orderId: newOrderId, // Pass Firestore ID back
      fields: { ...data }, // Pass back the validated fields
    };
  } catch (error) {
    console.error("Failed to submit service request:", error);
    return {
      message: "Failed to submit service request. Please try again.",
      success: false,
    };
  }
}

// --- Diagnosis Actions ---
const diagnosisSchema = z.object({
  applianceType: z.custom<ApplianceType>((val) => val !== undefined, "Please select an appliance type."),
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
      applianceType: applianceType as string, // Cast as AI flow expects string
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

// --- Auth Actions ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "securepassword123";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginState = {
  success: boolean;
  message: string;
};

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const rawFormData = Object.fromEntries(formData);
  const parseResult = loginSchema.safeParse(rawFormData);

  if (!parseResult.success) {
    return {
      success: false,
      message: "Invalid email or password format. Please check your input.",
    };
  }

  const email = parseResult.data.email.trim();
  const password = parseResult.data.password;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    cookies().set(SESSION_COOKIE_NAME, "true", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax', // Changed from none to lax for better security defaults
    });
    redirect('/admin'); 
  } else {
    return {
      success: false,
      message: "Invalid email or password. Please double-check your credentials and try again.",
    };
  }
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/login');
}
