import React, { type ChangeEvent, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

export interface Session {
  _id?: string; // _id is optional here since it's not needed for adding a new session
  sessionDate: string;
  region: string;
  staff: string[];
  archived: boolean;
  expectedAttendance: string[];
  actualAttendance: string[];
}

export function AddSession({
  notify,
  setNotify,
}: {
  notify: boolean;
  setNotify: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [newSession, setNewSession] = useState<Session>({
    sessionDate: "",
    region: "",
    staff: [],
    archived: false,
    expectedAttendance: [],
    actualAttendance: [],
  });

  const handleAddSession = async () => {
    try {
      await fetch("http://localhost:3001/session", {
        method: "POST",
        body: JSON.stringify(newSession),
        headers: { "Content-Type": "application/json" },
      });
      setNotify(!notify);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    field: keyof Session,
  ) => {
    setNewSession({ ...newSession, [field]: e.target.value });
  };

  const handleArrayChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: keyof Session,
  ) => {
    setNewSession({
      ...newSession,
      [field]: e.target.value.split(",").map((item) => item.trim()),
    });
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
              Session Date
            </Label>
            <Input
              type="date"
              value={newSession.sessionDate}
              onChange={(e) => handleChange(e, "sessionDate")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Region
            </Label>
            <Input
              type="text"
              value={newSession.region}
              onChange={(e) => handleChange(e, "region")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Staff (csv)
            </Label>
            <Textarea
              id="pnum"
              value={newSession.staff.join(", ")}
              onChange={(e) => handleArrayChange(e, "staff")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Expected Attendance
            </Label>
            <Textarea
              id="currsavings"
              value={newSession.expectedAttendance.join(", ")}
              onChange={(e) => handleArrayChange(e, "expectedAttendance")}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleAddSession}>Save Session</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
