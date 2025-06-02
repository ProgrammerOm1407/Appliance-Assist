
// src/lib/actions.ts
"use server";

import { z } from "zod";
import { diagnoseIssue as genAiDiagnoseIssue } from "@/ai/flows/diagnose-issue";
import type { ServiceRequest, ApplianceType } from "./types";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME } from "./constants";

// --- Service Request Actions ---
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
  const orderId = Math.random().toString(36).substr(2, 9);

  console.log("Service Request Submitted (Server Action):", data);

  return {
    message: "Service request submitted successfully!",
    success: true,
    orderId: orderId,
    fields: { ...data, id: orderId, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any,
  };
}

// --- Diagnosis Actions ---
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
      applianceType: applianceType as string,
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
// WARNING: These are hardcoded credentials for demonstration.
// In a real application, use a secure authentication system (e.g., Firebase Auth) and hashed passwords.
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

  const email = parseResult.data.email.trim(); // Trim email
  const password = parseResult.data.password; // Password should be exact

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    (await cookies()).set(SESSION_COOKIE_NAME, "true", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
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
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

