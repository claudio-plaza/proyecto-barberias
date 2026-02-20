"use client";

import AdminPanel from "@/components/admin/AdminPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAdmin, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AdminPage State:", { loading, isAdmin, email: user?.email });
    if (!loading && !isAdmin) {
      console.warn("Acceso denegado: Redirigiendo a home...");
      router.push("/");
    }
  }, [isAdmin, loading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest italic">Verificando Credenciales...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // O un mensaje de error breve antes del redirect
  }

  return (
    <div className="min-h-screen bg-background pt-12">
      <AdminPanel />
    </div>
  );
}
