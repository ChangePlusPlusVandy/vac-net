import React, { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { ItemCreateButton } from "@/components/create-item-button";
import SessionCard from "@/components/cards/session-card";
import SessionToolbar from "@/components/toolbars/session-toolbar";
import { AddSession } from "./add-session";

export interface Session {
  _id?: string;
  sessionDate?: Date;
  region?: string;
  staff?: string[];
  archived?: boolean;
  __V?: number;
  actualAttendance?: string[];
  expectedAttendance?: string[];
}

const Sessions = () => {
  const [query, setQuery] = useSearchParams();
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, setSortDirection] = useState("Ascending");
  const [notifyNew, setNotifyNew] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // I've been trying to have it sort by date by default, but I can't figure it out.
  // There's also a bug where reseting when *only* the Sort By is changed will not work
  // This bug (is it even a bug?) is also present in the beneficiaries page too
  useEffect(() => {
    if (!sort) return;

    // direction is connected to the double arrow button in the toolbar.
    // it controls direction of the sort
    const direction = sortDirection === "Ascending" ? 1 : -1;
    switch (sort) {
      case "1":
        console.log("sort by Date");
        const dateSort = [...sessions];
        dateSort.sort((a, b) => {
          if (a.sessionDate && b.sessionDate) {
            return (
              direction *
              (new Date(a.sessionDate).getTime() -
                new Date(b.sessionDate).getTime())
            );
          }
          return 0;
        });
        setSessions(dateSort);
        break;
      case "2":
        console.log("sort by attendance");
        const expectedSort = [...sessions];
        expectedSort.sort((a, b) => {
          if (a.expectedAttendance && b.expectedAttendance) {
            return (
              direction *
              (a.expectedAttendance.length - b.expectedAttendance.length)
            );
          }
          return 0;
        });
        setSessions(expectedSort);
        break;
      case "3":
        const regionSort = [...sessions];
        regionSort.sort((a, b) => {
          if (a.region && b.region) {
            return direction * a.region.localeCompare(b.region);
          }
          return 0;
        });
        setSessions(regionSort);
        break;
      case "4":
      // TODO
    }
  }, [sort, sortDirection]);

  useEffect(() => {
    const getSessions = async () => {
      try {
        const data: Session[] = await fetch(
          "http://localhost:3001/session/sessions",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res: Response) => res.json() as unknown as Session[]);
        //console.log(data);
        // TODO: decide what the initial sort should be
        setSessions(data);
      } catch (error) {
        console.error(error);
      }
    };
    void getSessions();
  }, [notifyNew]);

  // Status is checked via dates.
  // There isn't a status parameter in the Session object.
  const handleFilters = (s: Session) => {
    if (!status) return true;

    switch (status) {
      case "1":
        if (s.sessionDate) return compareDate(s.sessionDate) === "Complete";
      case "2":
        if (s.sessionDate) return compareDate(s.sessionDate) === "Upcoming";
      case "3":
        if (s.sessionDate) return compareDate(s.sessionDate) === "Today";
      case "4":
        if (s.expectedAttendance && s.actualAttendance)
          return s.actualAttendance.length !== s.expectedAttendance.length;

      // TODO: add rest of cases
    }
  };

  // I have this function defined twice: here and session-card.tsx
  // Please fix if necessary
  const compareDate = (date: Date) => {
    const now = new Date();
    // formattedDate is necessary
    const formattedDate = new Date(date);
    //This is a check for same day, because now.getTime() does not equal formattedDate.getTime()
    if (
      now.getFullYear() === formattedDate.getFullYear() &&
      now.getMonth() === formattedDate.getMonth() &&
      now.getDay() === formattedDate.getDay()
    )
      return "Today";
    if (Date.now() < formattedDate.getTime()) return "Upcoming";
    return "Complete";
  };

  // const formatDate = (date: Date) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(date).toLocaleDateString([], options);
  // };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sessions"
        text="View and manage your session data."
      >
        <AddSession setNotify={setNotifyNew} notify={notifyNew} />
      </DashboardHeader>
      <SessionToolbar
        query={query.get("f")}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
      {/* I don't get the get("f") stuff so please change if it is unnecessary */}
      <div className="py-3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {sessions
          .filter((ses) => {
            if (!query.get("f")) return true;
            return (
              // Can't figure how to search for a date. That should be added.
              ses.region
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              ses._id
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "")
            );
          })
          .filter((ses) => handleFilters(ses))
          .map((ses, i) => {
            return <SessionCard session={ses} key={i} />;
          })}
      </div>
    </DashboardShell>
  );
};

export default Sessions;
