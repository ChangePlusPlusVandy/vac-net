import React, { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { useParams, useSearchParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { type Beneficiary as BeneType } from "@/pages/beneficiaries/beneficiaries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";

const Beneficiary = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [beneficiary, setBeneficiary] = useState<BeneType | null>(null);
  const [beneName, setBeneName] = useState("");

  const handleSaveBeneficiary = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        await fetch(
          `http://localhost:3001/beneficiary?_id=${beneficiary?._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(beneficiary),
          },
        ).then((res: Response) => res.json() as unknown as BeneType);
        setEditing(false);
        setParams({ f: "0" });
      } catch (err) {
        console.error(err);
      }
    } else {
      setParams({ f: "1" });
      setEditing(true);
    }
  };

  useEffect(() => {
    const getBeneficiaryById = async () => {
      setIsLoading(true);
      try {
        const res: BeneType = await fetch(
          `http://localhost:3001/beneficiary/id/?id=${id}`,
        ).then((res: Response) => res.json() as unknown as BeneType);
        setBeneficiary(res);
        setBeneName(res.firstName + " " + res.lastName);
        console.log(res);
      } catch (error) {
        // TODO: add beneficiary not found state
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void getBeneficiaryById();
  }, [id, editing]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary({ ...beneficiary, firstName: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary({ ...beneficiary, lastName: e.target.value });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary({ ...beneficiary, phoneNumber: e.target.value });
  };

  const handleCurrentSavingsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBeneficiary({
      ...beneficiary,
      currentSavings: parseInt(e.target.value),
    });
  };

  const handleCurrentSpendingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBeneficiary({
      ...beneficiary,
      currentSpending: parseInt(e.target.value),
    });
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading={beneName ? beneName : "Beneficiary"}
        text={
          "View and edit " +
          (beneName ? beneName : "this beneficiary") +
          "'s data"
        }
      >
        <div>
          <SaveBeneficiary
            isLoading={isLoading}
            editing={params.get("f") === "1"}
            onClick={handleSaveBeneficiary}
          />
          {params.get("f") === "1" && (
            <button
              className={buttonVariants({ variant: "outline" })}
              onClick={() => setParams({ f: "0" })}
            >
              <Icons.close className="mr-2 h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
      </DashboardHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            First Name
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={beneficiary?.firstName}
            onChange={handleFirstNameChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Last Name
          </Label>
          <Input
            id="lname"
            className="col-span-1 pr-1"
            value={beneficiary?.lastName}
            onChange={handleLastNameChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Phone Number
          </Label>
          <Input
            id="pnum"
            type="number"
            className="col-span-1"
            value={beneficiary?.phoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        {beneficiary?.birthday && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Birth Date
            </Label>
            <DatePicker
              date={beneficiary?.birthday}
              // setDate={handleBirthDateChange}
            />
          </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Current Savings
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.currentSavings}
            onChange={handleCurrentSavingsChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Current Spending
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            value={beneficiary?.currentSpending}
            onChange={handleCurrentSpendingChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-1/2">
            <Label htmlFor="name" className="text-left">
              Associated Loans
            </Label>
          </div>
          <div className="w-1/2">
            <Label htmlFor="name" className="text-left">
              Associated Sessions
            </Label>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Beneficiary;

const SaveBeneficiary = ({
  isLoading,
  editing,
  onClick,
}: {
  isLoading: boolean;
  editing: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={cn(
        buttonVariants({}),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        "mr-4",
      )}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          {editing ? (
            <Icons.save className="mr-2 h-4 w-4" />
          ) : (
            <Icons.edit className="mr-2 h-4 w-4" />
          )}
        </>
      )}
      {editing ? "Save Changes" : "Edit Beneficiary"}
    </button>
  );
};
