import React, { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";
import LoanCard from "@/components/cards/loan-card";
import LoanToolbar from "@/components/toolbars/loan-toolbar";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { AddLoan } from "./add-loans";
import { Beneficiary } from "../beneficiaries/beneficiaries";

export interface Loan {
  _id?: string;
  initialPayment?: number;
  initialPaymentDate?: Date;
  principalLeft?: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
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
      case "1": //issue date 
        console.log("sort by issue date");
        const issueDateSort = [...loans];
        issueDateSort.sort((a, b) => {
          if (a.initialPaymentDate && b.initialPaymentDate) {
            return (
              new Date(a.initialPaymentDate).getTime() - new Date(b.initialPaymentDate).getTime()
            );
          }
          return 0;
        });
        setLoans(issueDateSort);
        break;
      case "2": //initial loan amount (initialPayment?)
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
      case "3": //remaining principal 
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

useEffect (() => {
  const getLoans = async () => {
    try {
      const data: Loan[] = await fetch(
        "http://localhost:3001/loan/getall",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res: Response) => res.json() as unknown as Loan[]);
      console.log(data);
      // TODO: decide what the initial sort should be
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
    case "0":
      return l.loanStatus === "Pending Approval";
    case "1":
      return l.loanStatus === "Good Standing";
    case "2":
      return l.loanStatus === "Delinquient";
    case "3":
      return l.loanStatus === "Fully Paid Off";
  }
};
  return (
    <DashboardShell>
      <DashboardHeader heading="Loans" 
      text="View and manage your loan data.">
        <ItemCreateButton item="Add Loan" />
      </DashboardHeader>
      <LoanToolbar
        query={query.get("f") || ""}
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
              loans.loanStatus
                  ?.toLowerCase()
                  .includes(query.get("f")?.toLowerCase() ?? "") ??
                loans.beneficiary
                  ?.includes(query.get("f")?.toLowerCase() ?? "") ??
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
      <div>loans</div>
    </DashboardShell>
  );
};

export default Loans;
