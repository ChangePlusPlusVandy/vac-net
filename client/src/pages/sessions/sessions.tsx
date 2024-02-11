import React, { useEffect, useState } from "react";

import { AddSession } from "./add-session";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import SessionCard from "@/components/cards/session-card";
import SessionToolbar from "@/components/toolbars/session-toolbar";

export interface Session {
  _id: string;
  sessionDate: Date;
  region: string;
  staff: string[];
  archived?: boolean;
  expectedAttendance: string[];
  actualAttendance: string[];
}

export interface ISession {
  _id: string;
  sessionDate: Date;
  region: string;
  staff: string[];
  archived?: boolean;
  expectedAttendance: string[];
  actualAttendance: string[];
}

const Sessions = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [notifyNew, setNotifyNew] = useState(false); // State to trigger refresh of session list

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("http://localhost:3001/session/sessions", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = (await response.json()) as Session[];
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    void fetchSessions();
  }, [notifyNew]); // Dependencies array is empty if we want this to run only once on component mount

  useEffect(() => {
    if (!sort) return;
    const sortedSessions = [...sessions];

    switch (sort) {
      case "meetingdate":
        sortedSessions.sort(
          (a, b) =>
            new Date(a.sessionDate).getTime() -
            new Date(b.sessionDate).getTime(),
        );
        break;
      case "expectedattendance":
        sortedSessions.sort(
          (a, b) => a.expectedAttendance.length - b.expectedAttendance.length,
        );
        break;
      default:
        // No sorting applied if sort value is unrecognized
        break;
    }

    setSessions(sortedSessions);
  }, [sort, sessions]);

  const handleFilters = (session: Session) => {
    const today = new Date();
    const sessionDate = new Date(session.sessionDate);
    let statusMatch = true;

    switch (status) {
      case "completed":
        // Assuming "Completed" means the session date is in the past and all expected attendees have attended.
        statusMatch =
          sessionDate < today &&
          session.actualAttendance.length === session.expectedAttendance.length;
        break;
      case "comingup":
        // Assuming "Coming Up" means the session date is in the future.
        statusMatch = sessionDate > today;
        break;
      case "happeningsoon":
        // Assuming "Happening Soon" means the session is within the next 7 days.
        const oneWeekLater = new Date(today);
        oneWeekLater.setDate(today.getDate() + 7);
        statusMatch = sessionDate > today && sessionDate <= oneWeekLater;
        break;
      case "hasmissingattendees":
        // Assuming "Has Missing Attendees" means not all expected attendees have attended.
        statusMatch =
          session.actualAttendance.length < session.expectedAttendance.length;
        break;
      default:
        // No filter is applied if no status is selected or an unrecognized status is given.
        break;
    }

    const queryMatch =
      !query || session.region.toLowerCase().includes(query.toLowerCase());

    return statusMatch && queryMatch;
  };

  // Function to handle deletion
  const handleSessionDeletion = (sessionId: string) => {
    setSessions(sessions.filter((session) => session._id !== sessionId));
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sessions"
        text="View and manage your session data."
      >
        <AddSession notify={notifyNew} setNotify={setNotifyNew} />
      </DashboardHeader>
      <SessionToolbar
        query={query}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div className="py-3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {sessions
          .filter((session) => handleFilters(session))
          .map((session) => (
            <SessionCard
              session={session}
              key={session._id}
              onDelete={handleSessionDeletion}
            />
          ))}
      </div>
    </DashboardShell>
  );
};

export default Sessions;
