import { AuthError } from "expo-auth-session";
import { setStorageItemAsync, useStorageState } from "./useStorageState";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";

// export type AuthUser = {
//   id: string;
//   email: string;
//   display_name?: string;
// };

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  display_name: string;
};

const AuthContext = createContext<{
  user?: User | null;
  setUser: (user: User | null) => void;
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => void;
  session?: Session | null;
  setSession: (session: Session | null) => void;
  loading?: boolean;
  setLoading: (loading: boolean) => void;
  error?: AuthError | null;
  setError: (error: AuthError | null) => void;
}>({
  user: null,
  setUser: () => null,
  signIn: async () => Promise.resolve(),
  signUp: async () => Promise.resolve(),
  signOut: () => null,
  session: null,
  setSession: () => null,
  loading: true,
  setLoading: () => {},
  error: null,
  setError: () => null,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useSession must be wrapped in a <AuthProvider />");
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signIn = async ({ email, password }: SignInParams) => {
    setLoading(true);
    setError(null);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error as any);
        return;
      }
      if (!data.session) {
        setError({
          name: "AuthSessionMissing",
          message: "No session returned from sign in",
        } as any);
        return;
      }
      setSession(data.session);
      setUser(data.session.user);
    } catch (error) {
      console.log("Sign-in error:", error);
      setError({
        name: "AuthUnknown",
        message: "Unknown error during sign in",
      } as any);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password, display_name }: SignUpParams) => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { display_name: display_name },
        },
      });
      console.log("session", session);

      if (error) {
        setError(error as any);
        return;
      }
      if (!session) {
        setError({
          name: "AuthSessionMissing",
          message: "No session returned from sign up",
        } as any);
        return;
      }
      setSession(session);
      setUser(session.user);
    } catch (error) {
      console.log("Sign-up error:", error);
      setError({
        name: "AuthUnknown",
        message: "Unknown error during sign up",
      } as any);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.log("Error signing out:", error);
      // setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signUp,
        signOut,
        session,
        setSession,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
