import React, { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import LoanCard from "@/components/cards/loan-card";
import LoanToolbar from "@/components/toolbars/loan-toolbar";
import { useSearchParams } from "react-router-dom";
import { AddLoan } from "./add-loans";
import { type Beneficiary } from "../beneficiaries/beneficiaries";

export interface Loan {
  _id?: string;
  initialPayment?: number;
  initialPaymentDate?: Date;
  principalLeft?: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
  paymentFrequency?: string;
  archivedLoan?: boolean;
  beneficiary?: Beneficiary;
  validLoan?: boolean;
  loanStatus?: string;
}

const Loans = () => {
  const [query, setQuery] = useSearchParams();
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [notifyNew, setNotifyNew] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (!sort) return;

    switch (sort) {
      case "jd": //issue date
        console.log("sort by issue date");
        const issueDateSort = [...loans];
        issueDateSort.sort((a, b) => {
          if (a.initialPaymentDate && b.initialPaymentDate) {
            return (
              new Date(a.initialPaymentDate).getTime() -
              new Date(b.initialPaymentDate).getTime()
            );
          }
          return 0;
        });
        setLoans(issueDateSort);
        break;
      case "init-la": //initial loan amount (initialPayment?)
        console.log("sort by initial loan amount");
        const initialLoanSort = [...loans];
        initialLoanSort.sort((a, b) => {
          if (a.initialPayment && b.initialPayment) {
            return a.initialPayment - b.initialPayment;
          }
          return 0;
        });
        setLoans(initialLoanSort);
        break;
      case "remaining-la": //remaining principal
        console.log("sort by remaining principal");
        const remainingPrincipalSort = [...loans];
        remainingPrincipalSort.sort((a, b) => {
          if (a.principalLeft && b.principalLeft) {
            return a.principalLeft - b.principalLeft;
          }
          return 0;
        });
        setLoans(remainingPrincipalSort);
        break;
    }
  }, [sort]);

  useEffect(() => {
    const getLoans = async () => {
      try {
        const data: Loan[] = await fetch(
          "https://vacnet-backend-deploy.vercel.app/loan/getall",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res: Response) => res.json() as unknown as Loan[]);
        console.log(data);
        setLoans(data);
      } catch (error) {
        console.error(error);
      }
    };
    void getLoans();
  }, [notifyNew]);

  const handleFilters = (l: Loan) => {
    if (!status) return true;

    switch (status) {
      case "pending":
        return l.loanStatus === "Pending Approval";
      case "good":
        return l.loanStatus === "Good Standing";
      case "bad":
        return l.loanStatus === "Delinquient";
      case "paid":
        return l.loanStatus === "Fully Paid Off";
    }
  };
  return (
    <DashboardShell>
      <DashboardHeader heading="Loans" text="View and manage your loan data.">
        <AddLoan setNotify={setNotifyNew} notify={notifyNew} />
      </DashboardHeader>
      <LoanToolbar
        query={query.get("f")}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div className="py-3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {loans
          .filter((loans) => {
            if (!query.get("f")) return true;
            return (
              loans.beneficiary?.firstName
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              loans.beneficiary?.lastName
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              loans._id
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "")
            );
          })
          .filter((loans) => handleFilters(loans))
          .map((loans, i) => {
            return <LoanCard loan={loans} key={i} />;
          })}
      </div>
    </DashboardShell>
  );
};

export default Loans;
