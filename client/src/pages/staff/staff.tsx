import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import type { IStaff } from "@/pages/staff/staff-members";
import { Input } from "@/components/ui/input";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import StaffToolbar from "@/components/toolbars/staff-toolbar";
import type { ISession } from "../sessions/sessions";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
  const [sessions, setSessions] = useState<ISession | null>(null);

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


        

        <Label htmlFor="sessions" className="text-left">
              Associated Sessions
        </Label>


        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sessionDate" className="text-left">
            Date
          </Label>
          
          {staff?.sessions?.sessionDate != null ? 
          <Input
              id="sessionDate"
              className="col-span-1 pr-1"
              value={new Date(staff.sessions.sessionDate).toLocaleDateString()}
              // onChange={handleLastNameChange}
              disabled={true}
          /> 
          : <div>No Date Available</div>}
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sessionRegion" className="text-left">
            Region
          </Label>
          
          {staff?.sessions?.region ? 
            <Input
            id="sessionRegion"
            className="col-span-1 pr-1"
            value={staff?.sessions?.region}
            // onChange={handleLastNameChange}
            disabled={true}
            />
            :<div>No Region Available</div>
          }
          
        </div>

        
        <div className="grid grid-cols-4 items-center gap-4">
          
          <Label htmlFor="sessionStaff" className="text-left">
            Associated Staff
          </Label>

          {staff?.sessions?.staff && staff.sessions.staff.length > 0 ? 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
                <DropdownMenuLabel>Associated Staff</DropdownMenuLabel>
                {staff?.sessions?.staff.map(staff => (
                <DropdownMenuItem>
                  {staff}
                </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            :
            <div>No Staff Available</div>
          }


        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          {staff?.sessions?.archived ? 
            <Input
            id="sessionArchived"
            className="col-span-1 pr-1"
            value={staff?.sessions?.archived.toString()}
            // onChange={handleLastNameChange}
            disabled={true}
            />
          : <div></div>}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sessionStaff" className="text-left">
                Expected Attendance
          </Label>
          
          {staff?.sessions?.expectedAttendance && staff.sessions.expectedAttendance.length > 0 ? 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
                <DropdownMenuLabel>Expected Attendance</DropdownMenuLabel>
                {staff?.sessions?.expectedAttendance.map(attendee => (
                <DropdownMenuItem>
                  {attendee}
                </DropdownMenuItem>
              ))}

              </DropdownMenuContent>
            </DropdownMenu>
            : <div>No Expected Attendance</div>}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sessionStaff" className="text-left">
            Archived
          </Label>
          
          {staff?.sessions?.archived ? 
            <Input
            id="sessionArchived"
            className="col-span-1 pr-1"
            value={staff?.sessions?.archived.toString()}
            // onChange={handleLastNameChange}
            disabled={true}
            />
          : <div>No Archive Value Available</div>}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sessionStaff" className="text-left">
                Actual Attendance
          </Label>
          
          {staff?.sessions?.actualAttendance && staff.sessions.actualAttendance.length > 0 ? 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
                <DropdownMenuLabel>Actual Attendance</DropdownMenuLabel>
                {staff?.sessions?.actualAttendance.map(attendee => (
                <DropdownMenuItem>
                  {attendee}
                </DropdownMenuItem>
              ))}

              </DropdownMenuContent>
            </DropdownMenu>
            : <div>No Actual Attendance Available</div>}
        </div>
  
      </div>
    </DashboardShell>
  );
};

export default Staff;
