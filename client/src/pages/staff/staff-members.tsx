import React, { useEffect, useState } from "react";
import type { ISession } from "../sessions/sessions"
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";
import StaffToolbar from "@/components/toolbars/staff-toolbar";
import { useSearchParams } from "react-router-dom";
import StaffCard from "@/components/cards/staff-card"


export interface IStaff {
    firstName?: string;
    lastName?: string;
    firebaseUID?: string;
    joinDate?: Date;
    status?: string;
    clearance?: string;
    bookmarkedBeneficiaries?: string[];
    sessions?: ISession
  }


const StaffMembers = () => {
  const [staffMembers, setStaffMembers] = useState<IStaff[]>([]);
  const [notifyNew, setNotifyNew] = useState(false);
  const [query, setQuery] = useSearchParams()
  
  useEffect(() => {
    const getStaffMembers = async () => {
      try {
        const data : IStaff[] = await fetch(
          "http://localhost:3001/user/allstaff",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res: Response) => res.json() as unknown as IStaff[])
        console.log(data)
        setStaffMembers(data)
      }catch (e){
        console.log(e);
      }
    };

    void getStaffMembers()
  }, [notifyNew])


  return (
    <DashboardShell>
      <DashboardHeader
        heading="Staff"
        text="View and manage your staff members."
      >
        <ItemCreateButton item="Onboard New Member" />
      </DashboardHeader>
      {/* <StaffToolbar
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      /> */}
      <div className="py-3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {staffMembers.map((staff, i) => {
          return <StaffCard staff={staff} key={i}/>
        })}
      </div>
    </DashboardShell>
  );
};

export default StaffMembers

