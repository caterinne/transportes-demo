import { createContext, useContext, useEffect, useState } from "react";
import { listenAuthState, getUserProfile } from "../lib/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const perfil = await getUserProfile(firebaseUser.uid);
        setUser(firebaseUser);
        setProfile(perfil);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
