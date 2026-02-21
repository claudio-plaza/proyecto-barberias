import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  deleteDoc, 
  doc,
  where,
  getDocs,
  QueryDocumentSnapshot,
  QuerySnapshot,
  updateDoc
} from "firebase/firestore";
import { Appointment, UserProfile, Barber } from "@/types/models";

const AVATAR_PRESETS = [
  { id: "m1", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver", gender: "male" },
  { id: "m2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Preston", gender: "male" },
  { id: "m3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=George", gender: "male" },
  { id: "m4", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", gender: "male" },
  { id: "m5", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", gender: "male" },
  { id: "f1", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila", gender: "female" },
  { id: "f2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe", gender: "female" },
  { id: "f3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lara", gender: "female" },
  { id: "f4", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria", gender: "female" },
  { id: "f5", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava", gender: "female" },
];

export default function AdminPanel() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({ today: 0, totalMembers: 0, pending: 0, revenue: 0 });
  
  // States for adding staff
  const [newBarber, setNewBarber] = useState({ 
    name: "", 
    role: "", 
    gender: "male" as "male" | "female",
    img: AVATAR_PRESETS[0].url 
  });

  useEffect(() => {
    if (!db) return;

    // Listen to Appointments
    const qApp = query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(50));
    const unsubApp = onSnapshot(qApp, (snapshot: QuerySnapshot) => {
      const docs = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(docs);
      setStats(prev => ({
        ...prev,
        today: docs.filter((d: Appointment) => d.date === "Hoy").length,
        revenue: docs.reduce((acc: number, curr: Appointment) => acc + (curr.price || 0), 0)
      }));
    });

    // Listen to Barbers
    const unsubBarbers = onSnapshot(collection(db, "barbers"), (snapshot: QuerySnapshot) => {
      setBarbers(snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Barber)));
    });

    // Listen to Members (Users)
    const unsubMembers = onSnapshot(collection(db, "users"), (snapshot: QuerySnapshot) => {
      const membersData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as unknown as UserProfile));
      setMembers(membersData);
      setStats(prev => ({ ...prev, totalMembers: membersData.length }));
    });

    return () => {
      unsubApp();
      unsubBarbers();
      unsubMembers();
    };
  }, []);

  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarber.name || !newBarber.role) return;
    try {
      await addDoc(collection(db, "barbers"), {
        name: newBarber.name,
        role: newBarber.role,
        img: newBarber.img,
        createdAt: new Date(),
        isActive: true
      });
      setNewBarber({ 
        name: "", 
        role: "", 
        gender: "male",
        img: AVATAR_PRESETS[0].url 
      });
    } catch (error) {
      console.error("Error adding barber:", error);
    }
  };

  const handleDeleteBarber = async (id: string) => {
    if (!confirm("¿Eliminar a este barbero?")) return;
    try {
      await deleteDoc(doc(db, "barbers", id));
    } catch (error) {
      console.error("Error deleting barber:", error);
    }
  };

  const toggleMembership = async (uid: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "PENDING" : "ACTIVE";
    try {
      await updateDoc(doc(db, "users", uid), {
        membershipStatus: nextStatus
      });
    } catch (error) {
      console.error("Error updating membership:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold uppercase italic mb-8">Panel de Control Admin</h1>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl">
          <div className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Turnos Mes</div>
          <div className="text-3xl font-bold">{appointments.length}</div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Total Socios</div>
          <div className="text-3xl font-bold">{stats.totalMembers}</div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Pendientes Pago</div>
          <div className="text-3xl font-bold text-red-500">
            {members.filter(m => m.membershipStatus === "PENDING").length}
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Ingresos Estimados</div>
          <div className="text-3xl font-bold text-primary">${stats.revenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Agenda & Members */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Real-time Agenda */}
          <div className="glass rounded-3xl overflow-hidden p-8">
            <h2 className="text-xl font-bold uppercase mb-6 flex items-center justify-between">
              Agenda de Turnos
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded">Live</span>
            </h2>
            <div className="space-y-4">
              {appointments.length === 0 && <div className="text-center py-10 text-muted-foreground">No hay turnos registrados aún.</div>}
              {appointments.map((turno) => (
                <div key={turno.id} className="flex items-center justify-between p-4 rounded-xl border border-primary/5 hover:bg-white/5 transition-all">
                  <div className="flex gap-6 items-center">
                    <div className="text-primary font-bold w-12">{turno.time}</div>
                    <div>
                      <div className="font-medium">{turno.userName}</div>
                      <div className="text-xs text-muted-foreground">{turno.serviceName} • {turno.barberName}</div>
                    </div>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">{turno.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Members Table */}
          <div className="glass rounded-3xl p-8 overflow-x-auto">
            <h2 className="text-xl font-bold uppercase mb-6">Gestión de Socios (Zenith Members)</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="pb-4 px-2">Socio</th>
                  <th className="pb-4 px-2">Nivel</th>
                  <th className="pb-4 px-2 text-center">Reservas (Mes)</th>
                  <th className="pb-4 px-2 text-center">Visitas</th>
                  <th className="pb-4 px-2">Estado Pago</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {members.map(member => (
                  <tr key={member.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold">{member.displayName}</div>
                      <div className="text-[10px] opacity-60">{member.email}</div>
                    </td>
                    <td className="py-4 px-2">
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                         member.membershipLevel === "ORO" ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"
                       }`}>{member.membershipLevel}</span>
                    </td>
                    <td className="py-4 px-2 text-center font-mono">
                      {appointments.filter(a => a.userId === member.uid).length}
                    </td>
                    <td className="py-4 px-2 text-center font-mono">
                      {member.visitCount || 0}
                    </td>
                    <td className="py-4 px-2">
                      <button 
                        onClick={() => toggleMembership(member.uid, member.membershipStatus)}
                        className="flex items-center hover:opacity-80 transition-opacity outline-none"
                      >
                        <span className={`w-3 h-3 rounded-full inline-block mr-2 ${
                          member.membershipStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                        }`}></span>
                        <span className="text-[10px] uppercase font-bold">{member.membershipStatus || "PENDING"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Staff & Control */}
        <div className="space-y-8">
          
          {/* Staff Management */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-xl font-bold uppercase mb-6">Staff (Barberos)</h2>
            
            {/* Add Barber Form */}
            <form onSubmit={handleAddBarber} className="space-y-4 mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="text-[10px] uppercase font-bold text-primary mb-2">Nuevo Empleado</div>
              <input 
                type="text" 
                placeholder="Nombre"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
                value={newBarber.name}
                onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                required
              />
              <input 
                type="text" 
                placeholder="Especialidad (ej. Master Barber)"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary"
                value={newBarber.role}
                onChange={(e) => setNewBarber({ ...newBarber, role: e.target.value })}
                required
              />
              
              <div className="flex gap-4 mb-4">
                <button 
                  type="button"
                  onClick={() => {
                    const firstFemale = AVATAR_PRESETS.find(p => p.gender === "female")?.url;
                    setNewBarber({ ...newBarber, gender: "male", img: AVATAR_PRESETS[0].url });
                  }}
                  className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                    newBarber.gender === "male" ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground"
                  }`}
                >
                  Hombre
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const firstFemale = AVATAR_PRESETS.find(p => p.gender === "female")?.url;
                    setNewBarber({ ...newBarber, gender: "female", img: firstFemale || AVATAR_PRESETS[0].url });
                  }}
                  className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg border transition-all ${
                    newBarber.gender === "female" ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground"
                  }`}
                >
                  Mujer
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4 p-2 bg-black/40 rounded-xl border border-white/5">
                {AVATAR_PRESETS.filter(p => p.gender === newBarber.gender).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setNewBarber({ ...newBarber, img: preset.url })}
                    className={`aspect-square rounded-lg border-2 transition-all p-1 overflow-hidden ${
                      newBarber.img === preset.url ? "border-primary bg-primary/10" : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img src={preset.url} alt="Avatar" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              <button className="w-full py-3 bg-primary text-background rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                Añadir al Staff
              </button>
            </form>

            {/* List Barbers */}
            <div className="space-y-4">
              {barbers.map(barber => (
                <div key={barber.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                  <div className="flex items-center gap-3">
                    <img src={barber.img} alt={barber.name} className="w-10 h-10 rounded-full border border-primary/20" />
                    <div>
                      <div className="text-sm font-bold">{barber.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{barber.role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteBarber(barber.id!)}
                    className="text-red-500 hover:text-red-400 p-2 text-xs"
                  >
                    🗑
                  </button>
                </div>
              ))}
              {barbers.length === 0 && <div className="text-center text-xs text-muted-foreground italic">No hay empleados registrados.</div>}
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <h2 className="text-xl font-bold uppercase mb-6">Configuración</h2>
            <p className="text-xs text-muted-foreground">Próximamente: Ajustes de horarios de local, días festivos y precios globales.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
