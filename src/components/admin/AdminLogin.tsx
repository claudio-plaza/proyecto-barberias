"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginWithEmail } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      onClose();
    } catch (err) {
      setError("Credenciales inválidas. Verifica tu email y contraseña.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="glass w-full max-w-md p-8 rounded-3xl border-primary/20 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold uppercase italic">Acceso Admin</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">✕</button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Email Administrador</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="claudioplaza92@gmail.com"
              className="w-full bg-white/5 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all font-medium"
              required 
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-primary/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all font-medium"
              required 
            />
          </div>

          {error && <div className="text-red-500 text-xs text-center">{error}</div>}

          <button 
            type="submit"
            className="w-full bg-primary text-background py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all mt-4"
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}
