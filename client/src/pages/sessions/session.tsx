import React, { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";

export interface Session {
  _id?: string;
  sessionDate?: string; // Use string type for input compatibility
  region?: string;
  staff?: string[];
  archived?: boolean;
  expectedAttendance?: string[];
  actualAttendance?: string[];
}

const SessionEdit = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Convert array to comma-separated string for the input field
  const arrayToCsv = (arr: string[]) => arr.join(", ");

  // Convert comma-separated string back to array for state update
  const csvToArray = (csv: string) => csv.split(",").map((item) => item.trim());

  // Handler for the staff and attendance array fields
  const handleArrayChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: keyof Session,
  ) => {
    setSession({
      ...session,
      [field]: csvToArray(e.target.value),
      _id: session?._id ?? "",
    });
  };

  // Handler for the archived checkbox
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSession({ ...session, archived: e.target.checked });
  };
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/session/${sessionId}`,
        );
        const data: Session = (await response.json()) as Session;
        data.sessionDate = formatDateForInput(new Date(data.sessionDate ?? ""));
        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      void fetchSession();
    }
  }, [sessionId]);

  // Helper function to format the date to YYYY-MM-DD
  const formatDateForInput = (date: Date) => {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Session,
  ) => {
    setSession({ ...session, [field]: e.target.value });
  };

  const handleSaveSession = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error("Failed to save the session");
      }

      const updatedSession: Session = (await response.json()) as Session;
      setSession(updatedSession);
      navigate(`/app/sessions`);
    } catch (error) {
      console.error("Error saving session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Edit Session"
        text="Modify your session details here."
      >
        <Button onClick={handleSaveSession} disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            <Icons.save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </DashboardHeader>
      {session && (
        <div className="py-4">
          <div className="mb-4">
            <Label htmlFor="sessionDate">Session Date</Label>
            <Input
              type="date"
              id="sessionDate"
              value={session.sessionDate}
              onChange={(e) => handleChange(e, "sessionDate")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={session.region}
              onChange={(e) => handleChange(e, "region")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="staff">Staff</Label>
            <Textarea
              id="staff"
              value={arrayToCsv(session.staff ?? [])}
              onChange={(e) => handleArrayChange(e, "staff")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="expectedAttendance">Expected Attendance</Label>
            <Textarea
              id="expectedAttendance"
              value={arrayToCsv(session.expectedAttendance ?? [])}
              onChange={(e) => handleArrayChange(e, "expectedAttendance")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="actualAttendance">Actual Attendance</Label>
            <Textarea
              id="actualAttendance"
              value={arrayToCsv(session.actualAttendance ?? [])}
              onChange={(e) => handleArrayChange(e, "actualAttendance")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="archived"
              checked={session.archived}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <Label htmlFor="archived">Archived</Label>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default SessionEdit;
