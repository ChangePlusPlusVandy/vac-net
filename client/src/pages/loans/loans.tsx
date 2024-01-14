import React, { useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";
import LoanToolbar from "@/components/toolbars/loan-toolbar";

export interface Loan {
  _id?: string;
  initialPayment?: number;
  initialPaymentDate?: Date;
  principalLeft?: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
  archivedLoan?: boolean;
  beneficiary?: string;
  validLoan?: boolean;
  loanStatus?: string;
}

const Beneficiaries = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  return (
    <DashboardShell>
      <DashboardHeader heading="Loans" text="View and manage your loan data.">
        <ItemCreateButton item="Add Loan" />
      </DashboardHeader>
      <LoanToolbar
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div>loans</div>
    </DashboardShell>
  );
};

export default Beneficiaries;
