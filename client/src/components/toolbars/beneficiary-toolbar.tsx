import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Icons } from "../ui/icons";
import { Input } from "@/components/ui/input";
import React from "react";
import { type SetURLSearchParams } from "react-router-dom";

const loanStatus = [
  {
    value: "0",
    label: "Bookmarked",
  },
  {
    value: "1",
    label: "No Loan",
  },
  {
    value: "2",
    label: "Pending Approval",
  },
  {
    value: "3",
    label: "On Time",
  },
  {
    value: "4",
    label: "Delinquient",
  },
  {
    value: "5",
    label: "Fully Paid Off",
  },
];

const sortBy = [
  {
    value: "1",
    label: "First Name",
  },
  {
    value: "2",
    label: "Last Name",
  },
  {
    value: "3",
    label: "Join Date",
  },
  {
    value: "4",
    label: "Loan Amount",
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
          placeholder="Filter Beneficiaries"
          className="h-9 w-[150px] lg:w-[250px]"
          type="text"
          value={query ?? ""}
          onChange={(e) => setQuery({ f: e.target.value })}
        />
        <Combobox
          items={loanStatus}
          itemName="Filters"
          value={status}
          setValue={setStatus}
        />
        <Combobox
          items={sortBy}
          itemName="Sort By"
          value={sort}
          setValue={setSort}
        />
        {!!query || !!status || !!sort ? (
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
