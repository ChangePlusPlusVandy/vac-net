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
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div style={{ color: "#16a34a" }}>
            <Icons.logo className="mx-auto h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {" "}
            Welcome!
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign up
          </p>
        </div>
        <UserAuthForm isSignUp={true} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account? <br />
          <a
            onClick={() => navigate("/login")}
            className="hover:text-brand underline underline-offset-4 cursor-pointer"
          >
            Login in here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
