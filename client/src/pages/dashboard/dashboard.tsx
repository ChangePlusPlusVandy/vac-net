import { ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Icons } from "@/components/ui/icons";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type Loan } from "../loans/loans";

const Dashboard = () => {
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
  const [delinquentLoans, setDelinquentLoans] = useState<Loan[]>([]);
  const [absentBeneficiaries, setAbsentBeneficiaries] = useState([]);
  const [expectedIncome, setExpectedIncome] = useState(0);
  const [upcomingSesions, setUpcomingSessions] = useState(0);

  useEffect(() => {
    void fetch("https://vac-net-backend.vercel.app/beneficiary/count")
      .then((res) => res.json())
      .then((data) => {
        setTotalBeneficiaries(data.totalBeneficiaries);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    void fetch("https://vac-net-backend.vercel.app/session/noshows")
      .then((res) => res.json())
      .then((data) => {
        const absent = [];
        for (const key of data) {
          for (const beneficiary of key.expectedAttendance) {
            if (beneficiary && !key.actualAttendance.includes(beneficiary)) {
              absent.push(beneficiary);
            }
          }
        }
        console.log(absent);
        // @ts-expect-error TODO
        setAbsentBeneficiaries(absent);
      });

    void fetch("https://vac-net-backend.vercel.app/loan/getDelinquent")
      .then((res) => res.json())
      .then((data) => {
        setDelinquentLoans(data);
      });

    void fetch("https://vac-net-backend.vercel.app/session/count", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ days: 14 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUpcomingSessions(data.total);
      });

    void fetch("https://vac-net-backend.vercel.app/loan/expectedrev?days=14")
      .then((res) => res.json())
      .then((data) => {
        setExpectedIncome(data.total);
      });
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="View and manage your data.">
        <div className="flex flex-row space-x-5">
          <DatePickerWithRange />
          <DownloadData item="Download Data" />
        </div>
      </DashboardHeader>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Expected Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${expectedIncome}</div>
                <p className="text-xs text-muted-foreground">
                  in next two weeks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Sessions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{upcomingSesions}</div>
                <p className="text-xs text-muted-foreground">
                  in next two weeks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Beneficiaries
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalBeneficiaries}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Delinquient Loans</CardTitle>
                <CardDescription>
                  Follow up with these beneficiaries and provide support.
                </CardDescription>
                {delinquentLoans.length > 0 && (
                  <div className="text-muted-foreground">
                    {delinquentLoans.map((loan, i) => {
                      if ((loan?.beneficiaries ?? []).length === 0) {
                        return null;
                      }
                      return (
                        <p key={i}>
                          {/* @ts-expect-error TODO */}
                          {loan.beneficiaries[0].firstName}{" "}
                          {/* @ts-expect-error TODO */}
                          {loan.beneficiaries[0]?.lastName}
                        </p>
                      );
                    })}
                  </div>
                )}
              </CardHeader>
              <CardContent className="pl-2"></CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Absent Beneficiaries</CardTitle>
                <CardDescription>
                  These beneficiaries didn't make it to their recent session.
                </CardDescription>
                {absentBeneficiaries.length > 0 && (
                  <div className="text-muted-foreground">
                    {absentBeneficiaries.map((bene, i) => {
                      return (
                        <p key={i}>
                          {/* @ts-expect-error TODO */}
                          {bene.firstName} {/* @ts-expect-error TODO */}
                          {bene.lastName}
                        </p>
                      );
                    })}
                  </div>
                )}
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
};

export default Dashboard;

const DownloadData = ({
  isLoading,
  onClick,
  item,
}: {
  isLoading?: boolean;
  onClick?: () => void;
  item: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant: "default" }), {
        "cursor-not-allowed opacity-60": isLoading,
      })}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.download className="mr-2 h-4 w-4" />
      )}
      {item}
    </button>
  );
};
