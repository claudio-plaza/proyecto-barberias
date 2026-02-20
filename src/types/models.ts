export type MembershipLevel = "BRONCE" | "PLATA" | "ORO" | "REGULAR";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string;
  role: "admin" | "user";
  membershipLevel: MembershipLevel;
  membershipStatus?: "ACTIVE" | "PENDING" | "INACTIVE";
  visitCount?: number;
  createdAt: any;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  img: string; // Changed from photoURL to match dicebear usage
  isActive: boolean;
  createdAt?: any;
}

export interface Appointment {
  id?: string;
  userId: string | "guest";
  userName: string;
  userPhone?: string;
  serviceId: string;
  serviceName: string;
  price: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: any;
}

export interface Membership {
  userId: string;
  level: MembershipLevel;
  status: "active" | "inactive" | "pending";
  expiresAt: any;
  benefitsUsedThisMonth: number;
}
