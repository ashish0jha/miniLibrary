import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";
import { getme, login as loginApi,logout as logoutApi } from "../api/auth";

interface AuthContextType {
    user:User | null;
    login: (username:string|undefined,email:string|undefined,password:string) => Promise<void>;
    logout:()=> Promise<void>;
    loading:Boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user ,setUser] = useState<User | null>(null);
  const [loading,setLoading] = useState<Boolean>(true);

  useEffect(()=>{
    getme()
        .then((res)=>setUser(res.data))
        .catch(()=>setUser(null))
        .finally(()=>setLoading(false))
  },[])

  async function login(username: string | undefined, email: string | undefined, password: string) {
    const res = await loginApi( username, email, password );
    setUser(res.data);
  }

  async function logout() {
    await logoutApi();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}