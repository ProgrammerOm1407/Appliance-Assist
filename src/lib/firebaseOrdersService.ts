
// src/lib/firebaseOrdersService.ts
'use server'; // Can be used by server actions

import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { ServiceRequest, ApplianceType } from './types';

const SERVICE_REQUESTS_COLLECTION = 'serviceRequests';

export interface NewServiceRequestData {
  applianceType: ApplianceType;
  issueDescription: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export async function addServiceRequest(data: NewServiceRequestData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, SERVICE_REQUESTS_COLLECTION), {
      ...data,
      status: 'pending', // Initial status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: '',
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding service request to Firestore: ", error);
    throw new Error("Could not create service request.");
  }
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const q = query(collection(db, SERVICE_REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const requests: ServiceRequest[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      requests.push({
        id: docSnapshot.id,
        applianceType: data.applianceType,
        issueDescription: data.issueDescription,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        status: data.status,
        // Firestore Timestamps need to be converted to ISO strings if components expect that
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
        notes: data.notes || '',
      } as ServiceRequest);
    });
    return requests;
  } catch (error) {
    console.error("Error fetching service requests from Firestore: ", error);
    return []; // Return empty array on error
  }
}

export async function updateServiceRequest(orderId: string, dataToUpdate: Partial<Omit<ServiceRequest, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const orderRef = doc(db, SERVICE_REQUESTS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating service request in Firestore: ", error);
    throw new Error("Could not update service request.");
  }
}
