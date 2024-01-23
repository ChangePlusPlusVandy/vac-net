import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import type { IStaff } from "@/pages/staff/staff-members";
import { Input } from "@/components/ui/input";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import StaffToolbar from "@/components/toolbars/staff-toolbar";

const Staff = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [staff, setStaff] = useState<IStaff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const getStaffById = async () => {
      setIsLoading(true);
      try {
        const data: IStaff = await fetch(
          "http://localhost:3001/user/getstaff?staffId=" + id,
        ).then((res: Response) => res.json() as unknown as IStaff);

        setStaff(data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    void getStaffById();
  }, [id, editing]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Staff"
        text={
          "View and edit " +
          staff?.firstName +
          " " +
          staff?.lastName +
          "'s data."
        }
      >
        <ItemCreateButton item="Onboard New Member" />
      </DashboardHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            First Name
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={staff?.firstName}
            // onChange={handleFirstNameChange}
            disabled={true}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Last Name
          </Label>
          <Input
            id="lname"
            className="col-span-1 pr-1"
            value={staff?.lastName}
            // onChange={handleLastNameChange}
            disabled={true}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Firebase UID
          </Label>
          <Input
            id="firebaseUID"
            className="col-span-1 pr-1"
            value={staff?.firebaseUID}
            // onChange={handleLastNameChange}
            disabled={true}
          />
        </div>
        {/* TODO: Display the date */}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Status
          </Label>
          <Input
            id="status"
            className="col-span-1 pr-1"
            value={staff?.status}
            // onChange={handleLastNameChange}
            disabled={true}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Clearance
          </Label>
          <Input
            id="clearance"
            className="col-span-1 pr-1"
            value={staff?.clearance}
            // onChange={handleLastNameChange}
            disabled={true}
          />
        </div>

        {/* TODO: Display bookmarked beneficiaries */}
        {/* TODO: Display sessions  */}
      </div>
    </DashboardShell>
  );
};

export default Staff;
