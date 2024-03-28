"use client";

import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { AlertDestructive } from "@/components/alert-destructive";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/../firebase/config";
import { cn } from "@/lib/utils";
import { type Staff } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ERRORS: Record<string, string> = {
  "Firebase: Error (auth/wrong-password).": "Incorrect username or password",
  "Firebase: Error (auth/user-not-found).": "Incorrect username or password",
  "Firebase: Error (auth/invalid-login-credentials).":
    "Incorrect username or password",
  "Firebase: Error (auth/invalid-email).": "Incorrect username or password",
  "Firebase: Error (auth/internal-error).": "Server error, please try again",
  "Firebase: Error (auth/missing-password).": "Password is required",
  "Firebase: Error (auth/email-already-in-use).": "Email already in use",
  "Passwords do not match": "Passwords do not match",
};

export function UserAuthForm({
  className,
  isSignUp,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const user = userCredential.user;

          const mongoUser = await fetch("http://localhost:3001/user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              firebaseUID: user.uid,
            }),
          }).then((res) => res.json() as unknown as Staff);
          console.log(mongoUser);

          // navigate("/app/dashboard");
        } catch (error) {
          setError((error as Error).message);
        }

        setIsLoading(false);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        navigate("/app/dashboard");
      } catch (error) {
        setError((error as Error).message);
      }

      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {error && <AlertDestructive errorDescription={ERRORS[error]} />}
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="pass"
              type="password"
              placeholder="Password"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isSignUp && (
            <div className="grid gap-1 mt-4">
              <Label className="sr-only" htmlFor="email">
                Confirm Password
              </Label>
              <Input
                id="pass"
                type="password"
                placeholder="Confirm Password"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <Button disabled={isLoading} className="mt-4">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  );
}
