"use client";

import { Icons } from "@/components/ui/icons";
import type { NavLink } from "react-router-dom";

type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: (typeof NavLink)[];
    }
);

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export function MainNav({ items }: DashboardNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <a href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          Vounteer Action Network
        </span>
      </a>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <a
              key={index}
              href={item.disabled ? "#" : item.href}
              className={
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground"
              }
            >
              {item.title}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
