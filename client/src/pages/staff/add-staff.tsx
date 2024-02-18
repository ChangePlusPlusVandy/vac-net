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

export function AddStaff({
  notify,
  setNotify,
}: {
  notify: boolean;
  setNotify: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firebaseUID, setFirebaseUID] = useState<string | undefined>();
  const [joinDate, setJoinDate] = useState("");
  const [status, setStatus] = useState("");
  const [clearance, setClearance] = useState("");

  const handleAddStaff = async () => {
    const data = {
      firstName,
      lastName,
      firebaseUID,
      joinDate,
      status,
      clearance,
    };
    console.log(data);
    try {
      await fetch("https://vacnet-backend-deploy.vercel.app/user", {
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
        <ItemCreateButton item="Onboard Member" />
      </SheetTrigger>
      <SheetContent className="min-w-[500px]" side="right">
        <SheetHeader>
          <SheetTitle>Onboard New Member</SheetTitle>
          <SheetDescription>
            You can always edit this information later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-light">
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
            <Label htmlFor="name" className="text-light">
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
            <Label htmlFor="name" className="text-light">
              Firebase UID
            </Label>
            <Input
              id="uid"
              value={firebaseUID}
              onChange={(e) => setFirebaseUID(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-light">
              Join Date
            </Label>
            <Input
              id="joindate"
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-light">
              Status
            </Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-light">
              Clearance
            </Label>
            <Input
              id="clearance"
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleAddStaff}>Save beneficiary</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
