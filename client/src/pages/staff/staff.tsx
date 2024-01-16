import React, { useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";
import StaffToolbar from "@/components/toolbars/staff-toolbar";

const Staff = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");


  return (
    <DashboardShell>
      <DashboardHeader
        heading="Staff"
        text="View and manage your staff members."
      >
        <ItemCreateButton item="Onboard New Member" />
      </DashboardHeader>
      <StaffToolbar
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

export default Staff;
