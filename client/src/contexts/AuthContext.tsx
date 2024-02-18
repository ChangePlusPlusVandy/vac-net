import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, UserCredential } from "firebase/auth";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../firebase/config";

export interface Staff {
  _id?: string;
  firstName?: string;
  lastName?: string;
  firebaseUID?: string;
  joinDate?: Date;
  status?: string;
  clearance?: string;
  bookmarkedBeneficiaries?: string[];
}

interface AuthContextData {
  currentUser: User | null;
  mongoUser: Staff | undefined;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  forgotPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, password: string) => Promise<void>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mongoUser, setMongoUser] = useState<Staff | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function registerUser(name: string, email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        void updateProfile(userCredential.user, {
          displayName: name,
        });
      },
    );
  }

  async function logout(): Promise<void> {
    return await signOut(auth);
  }

  function getUser(): User | null {
    return currentUser;
  }

  async function forgotPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(auth, email);
  }

  async function confirmReset(code: string, password: string): Promise<void> {
    return await confirmPasswordReset(auth, code, password);
  }

  async function getMongoUser(uid: string) {
    try {
      const res = await fetch(
        `https://vacnet-backend-deploy.vercel.app/user?firebaseUID=${uid}`,
      ).then((res) => res.json() as unknown as Staff[]);
      setMongoUser(res[0]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      void getMongoUser(currentUser.uid);
    }
  }, [currentUser, refresh]);

  const value = {
    currentUser,
    mongoUser,
    login,
    registerUser,
    logout,
    getUser,
    forgotPassword,
    confirmReset,
    refresh,
    setRefresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
