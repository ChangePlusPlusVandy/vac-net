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

export function AddSession({
  notify,
  setNotify,
}: {
  notify: boolean;
  setNotify: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [currentSavings, setCurrentSavings] = useState("");
  const [currentSpending, setCurrentSpending] = useState("");

  const handleAddSession = async () => {
    const data = {
      location,
      date,
      phoneNumber,
      currentSavings,
      currentSpending,
    };
    console.log(data);
    try {
      await fetch("http://localhost:3001/beneficiary/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      setNotify(!notify);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ItemCreateButton item="Add Session" />
      </SheetTrigger>
      <SheetContent className="w-full" side="right">
        <SheetHeader>
          <SheetTitle>Add Session</SheetTitle>
          <SheetDescription>
            You can always edit this information later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
            <Button onClick={handleAddSession}>Save beneficiary</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
