import { createContext, useCallback, useContext, useState } from "react";
import type { AuthType, Users } from "../utils/types";
import toast from "react-hot-toast";
import { apiDomain } from "@/utils/utils";

const authContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getUser = useCallback(async () => {
    const res = await fetch(`${apiDomain}/api/auth/is-auth`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    if (res.ok) {
      const { user } = await res.json();
      console.log("Auth data: ", user);
      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      const data = await res.json();
      console.log("Auth data: ", data);
      setUser(data);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  if (!user) {
    getUser();
  }

  const logout = async () => {
    const res = await fetch(`${apiDomain}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (res.ok) {
      const data = await res.json();
      toast(data.message);
      console.log(data);

      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      getUser();
    } else {
      console.log(res);

      return await res.json();
    }
  };

  return (
    <authContext.Provider
      value={{
        getUser,
        isAuthenticated,
        isLoading,
        logout,
        user,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("Must use useAuth within AuthContext Provider.");
  }
  return context;
};
