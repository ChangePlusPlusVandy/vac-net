import React, { useEffect, useState } from "react";

import BeneficiaryToolbar from "@/components/toolbars/beneficiary-toolbar";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";

const Beneficiaries = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Beneficaries"
        text="View and manage your beneficary data"
      >
        <ItemCreateButton item="Add Beneficary" />
      </DashboardHeader>
      <BeneficiaryToolbar
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div>beneficiaries</div>
    </DashboardShell>
  );
};

export default Beneficiaries;
