import React, { useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";
import SessionToolbar from "@/components/toolbars/session-toolbar";

const Beneficiaries = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sessions"
        text="View and manage your session data."
      >
        <ItemCreateButton item="Add Session" />
      </DashboardHeader>
      <SessionToolbar
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div>sessions</div>
    </DashboardShell>
  );
};

export default Beneficiaries;
