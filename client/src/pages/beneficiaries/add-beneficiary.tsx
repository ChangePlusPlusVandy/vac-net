import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddBeneficiary({
  notify,
  setNotify,
}: {
  notify: boolean;
  setNotify: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [currentSavings, setCurrentSavings] = useState("");
  const [currentSpending, setCurrentSpending] = useState("");

  const handleAddBeneficiary = async () => {
    const data = {
      firstName,
      lastName,
      phoneNumber,
      currentSavings,
      currentSpending,
    };
    try {
      toast.promise(
        async () => {
          const res = await fetch(
            "https://vacnet-backend-deploy.vercel.app/beneficiary/create",
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" },
            },
          );
          setNotify(!notify);
          return res;
        },
        {
          loading: "Adding Beneficiary...",
          success: () => {
            return `${firstName} has been added`;
          },
          error: "Error adding beneficiary",
        },
      );
    } catch (err) {
      console.log(err);
      toast.error(`There was an error adding ${firstName}`, {
        description: (err as Error).message,
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ItemCreateButton item="Add Beneficary" />
      </SheetTrigger>
      <SheetContent className="w-full" side="right">
        <SheetHeader>
          <SheetTitle>Add Beneficiary</SheetTitle>
          <SheetDescription>
            You can always edit this information later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              First Name
            </Label>
            <Input
              id="fname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Last Name
            </Label>
            <Input
              id="lname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Phone Number
            </Label>
            <Input
              id="pnum"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Current Savings
            </Label>
            <Input
              id="currsavings"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Current Spending
            </Label>
            <Input
              id="currspending"
              value={currentSpending}
              onChange={(e) => setCurrentSpending(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleAddBeneficiary}>Save beneficiary</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
