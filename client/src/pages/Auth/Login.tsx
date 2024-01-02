import React, { useEffect } from "react";

import { Icons } from "@/components/ui/icons";
import { UserAuthForm } from "./UserAuthForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/app/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <a
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <Icons.chevleft className="mr-2 h-4 w-4" />
        Back
      </a>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {" "}
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to login
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account? <br />
          <a
            href="mailto:raj.chopra@vanderbilt.edu"
            className="hover:text-brand underline underline-offset-4"
          >
            Contact your admin to get started.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
