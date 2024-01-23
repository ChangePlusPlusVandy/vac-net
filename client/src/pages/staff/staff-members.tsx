import React, { useEffect, useState } from "react";

import { AddBeneficiary } from "../beneficiaries/add-beneficiary";
import { AddStaff } from "./add-staff";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import type { ISession } from "../sessions/sessions";
import StaffCard from "@/components/cards/staff-card";
import StaffToolbar from "@/components/toolbars/staff-toolbar";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

export interface IStaff {
  _id?: string;
  firstName?: string;
  lastName?: string;
  firebaseUID?: string;
  joinDate?: Date;
  status?: string;
  clearance?: string;
  bookmarkedBeneficiaries?: string[];
  trackedSessions?: string[];
  sessions?: ISession;
}

const StaffMembers = () => {
  const [staffMembers, setStaffMembers] = useState<IStaff[]>([]);
  const [notifyNew, setNotifyNew] = useState(false);
  const [query, setQuery] = useSearchParams();
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const { mongoUser } = useAuth();

  useEffect(() => {
    if (!sort) {
      return;
    }

    switch (sort) {
      case "1":
        console.log("Sort by first name");
        const firstNameSort = [...staffMembers];

        firstNameSort.sort((a, b) => {
          if (a.firstName && b.firstName) {
            return a.firstName.localeCompare(b.firstName);
          }
          return 0;
        });

        console.log(firstNameSort);
        setStaffMembers(firstNameSort);
        break;

      case "2":
        console.log("Sort by last name");
        const lastNameSort = [...staffMembers];

        lastNameSort.sort((a, b) => {
          if (a.lastName && b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          return 0;
        });

        console.log(lastNameSort);
        setStaffMembers(lastNameSort);
        break;

      case "3":
        console.log("Sort by firebaseUID");
        const idSort = [...staffMembers];

        idSort.sort((a, b) => {
          if (a.firebaseUID && b.firebaseUID) {
            return a.firebaseUID.localeCompare(b.firebaseUID);
          }

          return 0;
        });

        console.log(idSort);
        setStaffMembers(idSort);
        break;

      case "4":
        console.log("Sort by join date");
        const dateSort = [...staffMembers];

        dateSort.sort((a, b) => {
          if (a.joinDate && b.joinDate) {
            const dateA = a.joinDate instanceof Date ? a.joinDate.getTime() : 0;
            const dateB = b.joinDate instanceof Date ? b.joinDate.getTime() : 0;

            return dateA - dateB;
          }

          return 0;
        });

        console.log(dateSort);
        setStaffMembers(dateSort);
        break;
    }
  }, [sort]);

  useEffect(() => {
    const getStaffMembers = async () => {
      try {
        const data: IStaff[] = await fetch(
          "http://localhost:3001/user/allstaff",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res: Response) => res.json() as unknown as IStaff[]);
        console.log(data);
        setStaffMembers(data);
      } catch (e) {
        console.log(e);
      }
    };

    void getStaffMembers();
  }, [notifyNew]);

  const handleFilters = (s: IStaff) => {
    if (!status) return true;

    switch (status) {
      case "0":
        return s.clearance == "Admin";
      case "1":
        return s.clearance == "Employee";
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Staff Members"
        text="View and manage your staff members."
      >
        <AddStaff setNotify={setNotifyNew} notify={notifyNew} />
      </DashboardHeader>
      <StaffToolbar
        query={query.get("f")}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div className="py-3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {staffMembers
          .filter((staff) => {
            if (!query.get("f")) return true;
            return (
              staff.firstName
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              staff.lastName
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              staff.firebaseUID
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "")
            );
          })
          .filter((staff) => handleFilters(staff))
          .map((staff, i) => {
            return <StaffCard staff={staff} key={i} />;
          })}
      </div>
    </DashboardShell>
  );
};

export default StaffMembers;
