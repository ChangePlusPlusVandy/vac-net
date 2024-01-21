import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { ItemCreateButton } from "@/components/create-item-button";
import SessionToolbar from "@/components/toolbars/session-toolbar";
import SessionCard from "@/components/cards/session-card";
import AddSession from "./add-session";

export interface Session {
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
  const [isAddingSession, setIsAddingSession] = useState(false); // New state variable to track if we're adding a new session

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
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [notifyNew]); // Dependencies array is empty if we want this to run only once on component mount  

  useEffect(() => {
    if (!sort) return;
    let sortedSessions = [...sessions];

    switch (sort) {
      case "meetingdate":
        sortedSessions.sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());
        break;
      case "expectedattendance":
        sortedSessions.sort((a, b) => a.expectedAttendance.length - b.expectedAttendance.length);
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
        statusMatch = sessionDate < today && session.actualAttendance.length === session.expectedAttendance.length;
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
        statusMatch = session.actualAttendance.length < session.expectedAttendance.length;
        break;
      default:
        // No filter is applied if no status is selected or an unrecognized status is given.
        break;
    }

    const queryMatch = !query || session.region.toLowerCase().includes(query.toLowerCase());

    return statusMatch && queryMatch;
  };

    // Function to be called when a new session is added
    const handleSessionAdded = () => {
      // Set notifyNew to true to re-fetch the session list
      setNotifyNew(true);
      
      // Optionally, reset the notifyNew state after some time
      // if you're using it as a toggle to trigger useEffect
      setTimeout(() => setNotifyNew(false), 1000);
  
      // Close the add session form
      setIsAddingSession(false);
    };

  // Function to handle deletion
  const handleSessionDeletion = (sessionId: string) => {
    setSessions(sessions.filter(session => session._id !== sessionId));
  };
  
  const handleAddSessionClick = () => {
    setIsAddingSession(true); // Show the add session form
  };

  const handleCancelAddSession = () => {
    setIsAddingSession(false); // Hide the add session form
  };
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sessions"
        text="View and manage your session data."
      >
        {!isAddingSession && (
          <Button onClick={() => setIsAddingSession(true)}>Add Session</Button>
        )}
      </DashboardHeader>
      {isAddingSession ? (
        <AddSession
          setNotify={setNotifyNew}
          onCancel={() => setIsAddingSession(false)}
          onSessionAdded={handleSessionAdded}
        />
      ) : (
        <>
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
              .filter(session => handleFilters(session))
              .map((session) => (
                <SessionCard
                  session={session}
                  key={session._id}
                  onDelete={handleSessionDeletion}
                />
              ))}
          </div>
        </>
      )}
    </DashboardShell>
  );  
};

export default Sessions;