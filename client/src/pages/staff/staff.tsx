import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import type { IStaff } from "@/pages/staff/staff-members";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import StaffToolbar from "@/components/toolbars/staff-toolbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Staff = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [staff, setStaff] = useState<IStaff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSaveStaff = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        await fetch(
          `https://vacnet-backend-deploy.vercel.app/user/edit?_id=${staff?._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(staff),
          },
        ).then((res: Response) => res.json() as unknown as IStaff);
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
    const getStaffById = async () => {
      setIsLoading(true);
      try {
        const data: IStaff = await fetch(
          "https://vacnet-backend-deploy.vercel.app/user/getstaff?staffId=" +
            id,
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

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({ ...staff, firstName: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({ ...staff, lastName: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({ ...staff, status: e.target.value });
  };

  const handleClearanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({ ...staff, clearance: e.target.value });
  };

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
        <SaveStaff
          isLoading={isLoading}
          editing={params.get("f") === "1"}
          onClick={handleSaveStaff}
        />
      </DashboardHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="fname" className="text-left">
            First Name
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={staff?.firstName}
            onChange={handleFirstNameChange}
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lname" className="text-left">
            Last Name
          </Label>
          <Input
            id="lname"
            className="col-span-1 pr-1"
            value={staff?.lastName}
            onChange={handleLastNameChange}
            disabled={params.get("f") !== "1"}
          />
        </div>

        {/* TODO: Display the date */}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-left">
            Status
          </Label>
          <Input
            id="status"
            className="col-span-1 pr-1"
            value={staff?.status}
            onChange={handleStatusChange}
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="clearance" className="text-left">
            Clearance
          </Label>
          <Input
            id="clearance"
            className="col-span-1 pr-1"
            value={staff?.clearance}
            onChange={handleClearanceChange}
            disabled={params.get("f") !== "1"}
          />
        </div>

        {/* TODO: Display bookmarked beneficiaries */}
        {/* TODO: Display sessions  */}
      </div>
    </DashboardShell>
  );
};

export default Staff;

const SaveStaff = ({
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
      {editing ? "Save Changes" : "Edit Staff Member"}
    </button>
  );
};
