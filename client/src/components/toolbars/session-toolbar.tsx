import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Icons } from "../ui/icons";
import { Input } from "@/components/ui/input";
import React from "react";

const sessionStatus = [
  {
    value: "pending",
    label: "Completed",
  },
  {
    value: "good",
    label: "Coming Up",
  },
  {
    value: "bad",
    label: "Happening Soon",
  },
  {
    value: "s",
    label: "Has Missing Attendees",
  },
];

const sortBy = [
  {
    value: "jd",
    label: "Meeting Date",
  },
  {
    value: "init-la",
    label: "Expected Attendence",
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
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center justify-between ml-1">
      <div className="flex flex-1 items-center space-x-4">
        <Input
          placeholder="Filter Sessions"
          className="h-9 w-[150px] lg:w-[250px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
