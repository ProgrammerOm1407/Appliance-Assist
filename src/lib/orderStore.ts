
"use client";
import type { ServiceRequest, ApplianceType } from './types';

// This file now primarily serves as an example or for non-Firestore local storage if needed elsewhere.
// The admin panel and main service request submission now use firebaseOrdersService.ts

const ORDERS_STORAGE_KEY = 'applianceAssistOrders_local_backup'; // Renamed to avoid conflict if keeping

const generateId = () => Math.random().toString(36).substr(2, 9);

export const getLocalOrders = (): ServiceRequest[] => {
  if (typeof window === 'undefined') return [];
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (storedOrders) {
    try {
      return JSON.parse(storedOrders);
    } catch (error) {
      console.error("Error parsing orders from localStorage:", error);
      return [];
    }
  }
  return [];
};

export const addLocalOrder = (orderData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): ServiceRequest => {
  if (typeof window === 'undefined') {
    console.warn("addLocalOrder called on server. Order not added to localStorage.");
    const newOrder: ServiceRequest = {
      ...orderData,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newOrder;
  }

  const orders = getLocalOrders();
  const newOrder: ServiceRequest = {
    ...orderData,
    id: generateId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updatedOrders = [...orders, newOrder];
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  return newOrder;
};

export const updateLocalOrder = (updatedOrder: ServiceRequest): ServiceRequest[] => {
  if (typeof window === 'undefined') return [];
  const orders = getLocalOrders();
  const updatedOrders = orders.map(o => (o.id === updatedOrder.id ? { ...updatedOrder, updatedAt: new Date().toISOString() } : o));
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  return updatedOrders;
};

/*
// Mock data initialization is no longer primary. Data will come from Firestore.
// Commenting out to prevent local storage population that might confuse with Firestore data.
export const initializeMockOrders = () => {
  if (typeof window === 'undefined') return;
  const existingOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!existingOrders || JSON.parse(existingOrders).length === 0) {
    const mockOrders: ServiceRequest[] = [
      {
        id: 'mock1',
        applianceType: 'fridge',
        issueDescription: 'Not cooling properly, making strange noises.',
        contactName: 'John Doe',
        contactEmail: 'john.doe@example.com',
        contactPhone: '555-1234',
        address: '123 Main St, Anytown, USA',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Customer reports intermittent cooling failure."
      },
      // ... other mock orders
    ];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mockOrders));
  }
};

if (typeof window !== 'undefined') {
  // initializeMockOrders(); // No longer initializing by default
}
*/
