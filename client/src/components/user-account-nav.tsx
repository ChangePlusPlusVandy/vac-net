"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type User as FirebaseUserType } from "firebase/auth";
import { UserAvatar } from "@/components/user-avatar";
import { auth } from "@/../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: FirebaseUserType;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.displayName ?? null,
            image: user.photoURL ?? null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.displayName && (
              <p className="font-medium">{user.displayName}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/app/settings">Settings</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/app/support">Support</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            void signOut(auth);
            toast.success("Signed Out!");
            navigate("/login");
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
