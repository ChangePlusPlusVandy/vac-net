import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Icons } from "../ui/icons";
import { Input } from "@/components/ui/input";
import React from "react";
import { type SetURLSearchParams } from "react-router-dom";

const loanStatus = [
  {
    value: "pending",
    label: "Pending Approval",
  },
  {
    value: "good",
    label: "Good Standing",
  },
  {
    value: "bad",
    label: "Delinquient",
  },
  {
    value: "paid",
    label: "Fully Paid Off",
  },
];

const sortBy = [
  {
    value: "jd",
    label: "Issue Date",
  },
  {
    value: "init-la",
    label: "Initial Loan Amount",
  },
  {
    value: "remaining-la",
    label: "Remaining Principal",
  },
];

const BeneficiaryToolbar = ({
  query,
  setQuery,
  status,
  setStatus,
  sort,
  setSort,
}: {
  query: string | null;
  setQuery: SetURLSearchParams;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center justify-between ml-1">
      <div className="flex flex-1 items-center space-x-4">
        <Input
          placeholder="Filter Loans"
          className="h-9 w-[150px] lg:w-[250px]"
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Combobox
          items={loanStatus}
          itemName="Loan Status"
          value={status}
          setValue={setStatus}
        />
        <Combobox
          items={sortBy}
          itemName="Sort By"
          value={sort}
          setValue={setSort}
        />
        {query !== "" || status !== "" || sort !== "" ? (
          <Button
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              setQuery("");
              setStatus("");
              setSort("");
            }}
          >
            Reset
            <Icons.close className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryToolbar;
