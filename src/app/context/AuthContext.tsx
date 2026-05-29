import { createContext, useContext, useState, ReactNode } from "react";

export type AccountType = "consumer" | "seller";
export type PartnershipType = "personal" | "commercial";
export type CommercialOrgType = "ong" | "biomassa" | "supermercado" | "escola" | "hospital" | "outro";
export type EstablishmentType = "restaurante" | "padaria" | "cafe" | "supermercado" | "hotel" | "catering" | "outro";

export interface ConsumerProfile {
  partnershipType: PartnershipType;
  name?: string; // personal
  orgName?: string; // commercial
  orgType?: CommercialOrgType; // commercial
}

export interface SellerProfile {
  establishmentType: EstablishmentType;
  establishmentName: string;
  location: string;
}

export interface AuthUser {
  email: string;
  accountType: AccountType;
  consumerProfile?: ConsumerProfile;
  sellerProfile?: SellerProfile;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => void;
  register: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string) => {
    setUser({
      email,
      accountType: "consumer",
      consumerProfile: { partnershipType: "personal", name: "Utilizador" },
    });
  };

  const register = (newUser: AuthUser) => {
    setUser(newUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
