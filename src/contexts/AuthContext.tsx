"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  signInAnonymously,
  signInWithEmailAndPassword
} from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setIsAdmin(data.role === "admin" || firebaseUser.email === "claudioplaza92@gmail.com");
          } else {
            const isEmailAdmin = firebaseUser.email === "claudioplaza92@gmail.com";
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Invitado",
              photoURL: firebaseUser.photoURL,
              role: isEmailAdmin ? "admin" : "user",
              membershipLevel: "REGULAR",
              createdAt: serverTimestamp()
            });
            setIsAdmin(isEmailAdmin);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("AuthContext Error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      alert("Firebase no está configurado. Por favor, añade las variables de entorno.");
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginAsGuest = async () => {
    if (!isFirebaseConfigured || !auth) {
      alert("Firebase no está configurado.");
      return;
    }
    await signInAnonymously(auth);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin: isAdmin || user?.email === "claudioplaza92@gmail.com", 
      loading, 
      loginWithGoogle, 
      loginAsGuest, 
      loginWithEmail,
      logout, 
      isConfigured: isFirebaseConfigured 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
