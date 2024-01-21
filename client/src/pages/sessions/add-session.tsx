import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export interface Session {
  _id?: string;  // _id is optional here since it's not needed for adding a new session
  sessionDate: string;
  region: string;
  staff: string[];
  archived: boolean;
  expectedAttendance: string[];
  actualAttendance: string[];
}

const AddSession = ({ onCancel, onSessionAdded }: { onCancel: () => void; onSessionAdded: () => void }) => {
  const navigate = useNavigate();
  const [newSession, setNewSession] = useState<Session>({
    sessionDate: "",
    region: "",
    staff: [],
    archived: false,
    expectedAttendance: [],
    actualAttendance: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Session) => {
    setNewSession({ ...newSession, [field]: e.target.value });
  };

  const handleArrayChange = (e: ChangeEvent<HTMLTextAreaElement>, field: keyof Session) => {
    setNewSession({ ...newSession, [field]: e.target.value.split(',').map(item => item.trim()) });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewSession({ ...newSession, archived: e.target.checked });
  };

  const handleAddSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSession),
      });

      if (!response.ok) {
        throw new Error('Failed to add the session');
      }
      onSessionAdded();
      onCancel();

      navigate("/app/sessions");
    } catch (error) {
      console.error("Error adding session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Add New Session" text="Enter the details for the new session.">
        <Button onClick={handleAddSession} disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            <Icons.save />
          )}
          Add Session
        </Button>
        <Button onClick={onCancel} variant="secondary" disabled={isLoading}>
          Cancel
        </Button>
      </DashboardHeader>
      <div className="py-4">
        <div className="mb-4">
          <Label htmlFor="sessionDate">Session Date</Label>
          <Input
            type="date"
            id="sessionDate"
            value={newSession.sessionDate}
            onChange={(e) => handleChange(e, 'sessionDate')}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            value={newSession.region}
            onChange={(e) => handleChange(e, 'region')}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="staff">Staff</Label>
          <textarea
            id="staff"
            value={newSession.staff.join(', ')}
            onChange={(e) => handleArrayChange(e, 'staff')}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="expectedAttendance">Expected Attendance</Label>
          <textarea
            id="expectedAttendance"
            value={newSession.expectedAttendance.join(', ')}
            onChange={(e) => handleArrayChange(e, 'expectedAttendance')}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="actualAttendance">Actual Attendance</Label>
          <textarea
            id="actualAttendance"
            value={newSession.actualAttendance.join(', ')}
            onChange={(e) => handleArrayChange(e, 'actualAttendance')}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="archived"
            checked={newSession.archived}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <Label htmlFor="archived">Archived</Label>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AddSession;