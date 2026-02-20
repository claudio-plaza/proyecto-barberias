"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AdminLogin from "../admin/AdminLogin";

export default function Navbar() {
  const { user, loginWithGoogle, logout, isConfigured, isAdmin } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass border-b border-primary/10">
        {!isConfigured && (
          <div className="bg-yellow-500/10 text-yellow-500 text-[10px] text-center py-1 uppercase tracking-tighter">
            Modo Maquetación: Firebase no configurado (Configura .env.local para usar Auth)
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
                MENDOZA BARBER CLUB
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/reserva" className="text-sm font-medium hover:text-primary transition-colors">Reserva</Link>
              <Link href="/membresia" className="text-sm font-medium hover:text-primary transition-colors">Membresías</Link>
              
              {isAdmin && (
                <Link href="/admin" className="text-sm font-bold text-primary px-3 py-1 border border-primary/30 rounded-lg hover:bg-primary/5 transition-all">
                  ADMIN
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{user.displayName || "Invitado"}</span>
                  <button onClick={logout} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Salir</button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowAdminLogin(true)}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </button>
                  <button 
                    onClick={loginWithGoogle}
                    className="bg-primary text-background px-6 py-2 rounded-full text-sm font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
                  >
                    Ingresar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
    </>
  );
}
