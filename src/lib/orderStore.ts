"use client";
import type { ServiceRequest, ApplianceType } from './types';

const ORDERS_STORAGE_KEY = 'applianceAssistOrders';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const getOrders = (): ServiceRequest[] => {
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

export const addOrder = (orderData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): ServiceRequest => {
  if (typeof window === 'undefined') {
    // This case should ideally not be hit if called from client components properly
    console.warn("addOrder called on server. Order not added to localStorage.");
    const newOrder: ServiceRequest = {
      ...orderData,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newOrder; // Return the order, but it won't be persisted server-side by this function
  }

  const orders = getOrders();
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

export const updateOrder = (updatedOrder: ServiceRequest): ServiceRequest[] => {
  if (typeof window === 'undefined') return [];
  const orders = getOrders();
  const updatedOrders = orders.map(o => (o.id === updatedOrder.id ? { ...updatedOrder, updatedAt: new Date().toISOString() } : o));
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  return updatedOrders;
};

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
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Customer reports intermittent cooling failure."
      },
      {
        id: 'mock2',
        applianceType: 'washing-machine',
        issueDescription: 'Leaking water from the bottom.',
        contactName: 'Jane Smith',
        contactEmail: 'jane.smith@example.com',
        contactPhone: '555-5678',
        address: '456 Oak Ave, Anytown, USA',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString(),
        notes: "Technician assigned. Parts ordered."
      },
      {
        id: 'mock3',
        applianceType: 'filter',
        issueDescription: 'Water filter needs replacement, flow is slow.',
        contactName: 'Alice Brown',
        contactEmail: 'alice.brown@example.com',
        contactPhone: '555-8765',
        address: '789 Pine Ln, Anytown, USA',
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        notes: "Filter replaced. System flushed. Customer satisfied."
      },
    ];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mockOrders));
  }
};

// Initialize mock orders when this module is loaded on the client side
if (typeof window !== 'undefined') {
  initializeMockOrders();
}
