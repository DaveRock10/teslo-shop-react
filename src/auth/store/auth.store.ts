import { create } from "zustand";
import type { User } from "@/interfaces/user.interface";
import { loginAction } from "../actions/login.action";
import { checkAuthAction } from "../actions/check-auth.action";
import { registerAction } from "../actions/register.action";
import type { AuthResponse } from "../interfaces/auth.response";
import type { AxiosError } from "axios";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

interface AuthState {
  //Properties
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;

  //Getters
  isAdmin: () => boolean;

  //Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AuthResponse>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  //implementación del store
  user: null,
  token: null,
  authStatus: "checking",

  isAdmin: () => {
    const roles = get().user?.roles || [];
    return roles.includes("admin");
  },

  login: async (email: string, password: string) => {
    console.log({ email, password });
    try {
      const data = await loginAction(email, password);
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, authStatus: "authenticated" });
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem("item");
    set({ user: null, token: null, authStatus: "not-authenticated" });
  },
  checkAuthStatus: async () => {
    try {
      const { user, token } = await checkAuthAction();
      set({ user, token, authStatus: "authenticated" });
      return true;
    } catch (error) {
      set({
        user: undefined,
        token: undefined,
        authStatus: "not-authenticated",
      });
      return false;
    }
  },
  register: async (
    email: string,
    password: string,
    name,
  ): Promise<AuthResponse> => {
    console.log({ email, password });
    try {
      const data = await registerAction(email, password, name);
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, authStatus: "authenticated" });
      return data;
    } catch (error) {
      const errorKnown = error as AxiosError;
      const data = errorKnown.response?.data as AuthResponse;
      localStorage.removeItem("token");
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return {
        message: data.message ? data.message : "Error desconocido",
        statusCode: data.statusCode ? data.statusCode : 500,
      } as AuthResponse;
    }
  },
}));
