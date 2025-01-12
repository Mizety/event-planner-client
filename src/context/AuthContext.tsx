"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  guest?: boolean;
}
interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResponse {
  message: string;
  errors: ValidationError[];
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<null | ValidationResponse>;
  guestLogin: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<null | ValidationResponse>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      console.log("Token found:", token);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        typeof window !== "undefined" && localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok && response.status === 400) {
        return (await response.json()) as ValidationResponse;
      }
      if (!response.ok && response.status === 401) {
        return {
          message: data.message,
          errors: [],
        };
      }

      if (!response.ok) {
        return {
          message: "Login failed",
          errors: [],
        };
      }

      if (!data.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", data.token);
      console.log("Token stored:", localStorage.getItem("token"));
      setUser({ ...data?.user, token: data?.token });
      return null;
    } catch (error) {
      console.error("Login error in context:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok && response.status === 400) {
        return data as ValidationResponse;
      }

      if (!response.ok && response.status === 401) {
        return {
          message: data.message,
          errors: [],
        };
      }

      if (!response.ok) {
        return {
          message: "Registration failed",
          errors: [],
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      typeof window !== "undefined" &&
        localStorage.setItem("token", data.token);
      setUser(data.user);
      await checkUser();
      return null;
    } catch (error) {
      console.error("Register error in context:", error);
      throw error;
    }
  };

  const logout = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    typeof window !== "undefined" && localStorage.removeItem("token");
    setUser(null);
  };
  const guestLogin = async () => {
    setUser({
      id: "guest",
      name: "Guest",
      email: "guest@guest.com",
      token: "",
      guest: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, guestLogin }}
    >
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
