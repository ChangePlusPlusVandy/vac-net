import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Icons } from "../ui/icons";
import { Input } from "@/components/ui/input";
import { DoubleArrowUpIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";

import React from "react";
import { type SetURLSearchParams } from "react-router-dom";

const sessionStatus = [
  {
    value: "1",
    label: "Completed",
  },
  {
    value: "2",
    label: "Coming Up",
  },
  {
    value: "3",
    label: "Happening Soon",
  },
  {
    value: "4",
    label: "Has Missing Attendees",
  },
];

const sortBy = [
  {
    value: "1",
    label: "Meeting Date",
  },
  {
    value: "2",
    label: "Expected Attendence",
  },
  {
    value: "3",
    label: "Region",
  },
];

const BeneficiaryToolbar = ({
  query,
  setQuery,
  status,
  setStatus,
  sort,
  setSort,
  sortDirection,
  setSortDirection,
}: {
  query: string | null;
  setQuery: SetURLSearchParams;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center justify-between ml-1">
      <div className="flex flex-1 items-center space-x-4">
        <Input
          placeholder="Filter Sessions"
          className="h-9 w-[150px] lg:w-[250px]"
          value={query ?? ""}
          onChange={(e) => setQuery({ f: e.target.value })}
        />
        <Combobox
          items={sessionStatus}
          itemName="Session Status"
          value={status}
          setValue={setStatus}
        />
        <Combobox
          items={sortBy}
          itemName="Sort By"
          value={sort}
          setValue={setSort}
        />
        {sort !== "" ? (
          sortDirection === "Ascending" ? (
            <Button
              variant="ghost"
              className="h-8 px-2 lg:px-3"
              value={sortDirection}
              onClick={() => setSortDirection("Descending")}
            >
              <DoubleArrowUpIcon></DoubleArrowUpIcon>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="h-8 px-2 lg:px-3"
              value={sortDirection}
              onClick={() => setSortDirection("Ascending")}
            >
              <DoubleArrowDownIcon></DoubleArrowDownIcon>
            </Button>
          )
        ) : (
          <></>
        )}
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
