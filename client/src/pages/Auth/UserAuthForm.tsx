"use client";

import React, { useEffect, useState } from "react";

import { AlertDestructive } from "@/components/alert-destructive";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/../firebase/config";
import { cn } from "@/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ERRORS: Record<string, string> = {
  "Firebase: Error (auth/wrong-password).": "Incorrect username or password",
  "Firebase: Error (auth/user-not-found).": "Incorrect username or password",
  "Firebase: Error (auth/invalid-login-credentials).":
    "Incorrect username or password",
  "Firebase: Error (auth/invalid-email).": "Incorrect username or password",
  "Firebase: Error (auth/internal-error).": "Server error, please try again",
  "Firebase: Error (auth/missing-password).": "Password is required",
};

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log(user);
      navigate("/app/dashboard");
    } catch (error) {
      setError((error as Error).message);
    }

    setIsLoading(false);
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
          <Button disabled={isLoading} className="mt-4">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
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
