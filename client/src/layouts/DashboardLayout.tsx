import { Outlet, useNavigate } from "react-router-dom";

import { type Icons } from "@/components/ui/icons";
import { useAuth } from "@/AuthContext";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { DashboardNav } from "@/components/nav";

type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

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
      items: string[];
    }
);

type DashboardConfig = {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Staff",
      href: "/app/staff",
    },
    {
      title: "Support",
      href: "/app/support",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/app/dashboard",
      icon: "dashboard",
    },
    {
      title: "Beneficiaries",
      href: "/app/beneficiaries",
      icon: "beneficiary",
    },
    {
      title: "Loans",
      href: "/app/loans",
      icon: "loan",
    },
    {
      title: "Sessions",
      href: "/app/sessions",
      icon: "session",
    },
    {
      title: "Settings",
      href: "/app/settings",
      icon: "settings",
    },
  ],
};

const DashboardLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <UserAccountNav user={currentUser} />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
};

export default DashboardLayout;
