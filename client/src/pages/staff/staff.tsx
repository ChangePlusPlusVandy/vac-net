import { Button, buttonVariants } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams, useSearchParams } from "react-router-dom";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import type { IStaff } from "@/pages/staff/staff-members";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import StaffToolbar from "@/components/toolbars/staff-toolbar";
import { cn } from "@/lib/utils";
import { type Session } from "../sessions/sessions";
import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Staff = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [staff, setStaff] = useState<IStaff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [allSessions, setAllSessions] = useState<Session[]>([]);

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
    const getAllSessions = async () => {
      setIsLoading(true);
      try {
        const data: Session[] = await fetch(
          "https://vac-net-backend.vercel.app/session/sessions",
        ).then((res: Response) => res.json() as unknown as Session[]);
        setAllSessions(data);
      } catch (e) {
        console.log(e);
      }
    };

    void getAllSessions();
  }, []);

  const handleRemoveSession = async () => {
    const response = await fetch(
      `https://vac-net-backend.vercel.app/user/${staff?._id}/sessions`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    setStaff({ ...staff, sessions: undefined });
    if (response.ok) {
      setStaff({ ...staff, sessions: undefined });
    } else {
      console.error("Failed to remove the session");
    }
  };

  const handleAddSession = async (sessionId: string) => {
    const response = await fetch(
      `https://vac-net-backend.vercel.app/user/${staff?._id}/sessions/${sessionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      try {
        const data: Session = await fetch(
          "https://vac-net-backend.vercel.app/session/" + sessionId,
        ).then((res: Response) => res.json() as unknown as Session);
        setStaff({ ...staff, sessions: [data] });
      } catch (e) {
        console.log(e);
      }
    } else {
      console.error("Failed to add the session");
    }
  };

  useEffect(() => {
    const getStaffById = async () => {
      setIsLoading(true);
      try {
        const data: IStaff = await fetch(
          "https://vac-net-backend.vercel.app/user/getstaff?staffId=" + id,
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
        <div>
          <SaveStaff
            isLoading={isLoading}
            editing={params.get("f") === "1"}
            onClick={handleSaveStaff}
          />
          {params.get("f") === "1" && (
            <button
              className={buttonVariants({ variant: "outline" })}
              onClick={() => {
                setParams({ f: "0" });
                setEditing(false);
              }}
            >
              <Icons.close className="mr-2 h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
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

        {staff?.sessions != null ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Session ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Archived</TableHead>
                <TableHead>Expected Attendance</TableHead>
                <TableHead>Actual Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff?.sessions?.map((session, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{session._id}</TableCell>
                    {session.sessionDate != null ? (
                      <TableCell>
                        {new Date(session.sessionDate).toLocaleDateString()}
                      </TableCell>
                    ) : (
                      <TableCell>Unknown</TableCell>
                    )}
                    {session.region != null ? (
                      <TableCell>{session.region}</TableCell>
                    ) : (
                      <TableCell>Unknown</TableCell>
                    )}
                    {session.staff != null ? (
                      <TableCell>{session.staff?.join(", ")}</TableCell>
                    ) : (
                      <TableCell>Unknown</TableCell>
                    )}
                    {session.archived != null ? (
                      <TableCell>{session.archived?.toString()}</TableCell>
                    ) : (
                      <TableCell>Unknown</TableCell>
                    )}
                    {session.expectedAttendance?.length != 0 ? (
                      <TableCell>
                        {session.expectedAttendance?.join(", ")}
                      </TableCell>
                    ) : (
                      <TableCell>Unknown</TableCell>
                    )}
                    {session.actualAttendance?.length != 0 ? (
                      <TableCell>
                        {session.actualAttendance?.join(", ")}
                      </TableCell>
                    ) : (
                      <TableCell>Unknown</TableCell>
                    )}
                    <TableCell>
                      {editing && (
                        <button
                          onClick={() => handleRemoveSession()}
                          aria-label="Remove session"
                        >
                          <Icons.close />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableCaption>Associated Sessions</TableCaption>
          </Table>
        ) : (
          <TableCell>
            {editing && (
              <DropdownMenu>
                <Label className="inline-flex mr-3">Add a Session</Label>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-2 shadow-none">
                    <PlusIcon className="h-4 w-10 text-secondary-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  alignOffset={-5}
                  className="w-[200px]"
                  forceMount
                >
                  <DropdownMenuLabel>Choose a Session</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allSessions?.map((session) => (
                    <DropdownMenuItem
                      key={session._id}
                      onClick={() => handleAddSession(session._id)}
                    >
                      {`${new Date(
                        session.sessionDate,
                      ).toLocaleDateString()} - ${session.region}`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TableCell>
        )}
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
