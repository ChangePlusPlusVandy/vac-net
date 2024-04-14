import React, { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { type Beneficiary } from "../beneficiaries/beneficiaries";
import { type Staff } from "@/contexts/AuthContext";
import { type Session } from "./sessions";
import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const SessionEdit = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [detailedBeneficiaries, setDetailedBeneficiaries] = useState<
    Beneficiary[]
  >([]);
  const [detailedActualAttendance, setDetailedActualAttendance] = useState<
    Beneficiary[]
  >([]);
  const [notifyChange, setNotifyChange] = useState(false);
  const [detailedStaff, setDetailedStaff] = useState<Staff[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
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
    // @ts-expect-error TODO
    setSession({
      ...session,
      [field]: csvToArray(e.target.value),
      _id: session?._id ?? "",
    });
  };

  // Handler for the archived checkbox
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-expect-error TODO
    setSession({ ...session, archived: e.target.checked });
  };

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://vacnet-backend-deploy.vercel.app/session/${sessionId}`,
        );
        const data: Session = (await response.json()) as Session;
        // @ts-expect-error TODO
        data.sessionDate = formatDateForInput(new Date(data.sessionDate ?? ""));
        setSession(data);
        console.log("Session data:", data);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      void fetchSession();
    }
  }, [sessionId, notifyChange]);

  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      if (!session?.expectedAttendance) return;

      try {
        // Fetch details for each associated loan
        const beneInfo = await Promise.all(
          session.expectedAttendance.map(async (bene) => {
            const response = await fetch(
              `https://vac-net-backend.vercel.app/beneficiary/id?id=${bene}`,
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          }),
        );

        // Update the state with the fetched beneficiary details
        setDetailedBeneficiaries(beneInfo);
      } catch (error) {
        console.error("Error fetching beneficiary details:", error);
      }
    };

    if (session?.expectedAttendance) {
      void fetchBeneficiaryDetails();
    }
  }, [session, notifyChange]);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      if (!session?.associatedStaff) return;

      try {
        // Fetch details for each associated staff
        const staffInfo = await Promise.all(
          session.associatedStaff.map(async (staff) => {
            const response = await fetch(
              `https://vac-net-backend.vercel.app/user/getstaff/?staffId=${staff}`,
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          }),
        );

        // Update the state with the fetched staff details
        setDetailedStaff(staffInfo);
      } catch (error) {
        console.error("Error fetching staff details:", error);
      }
    };

    if (session?.associatedStaff) {
      void fetchStaffDetails();
    }
  }, [session, notifyChange]);

  useEffect(() => {
    const fetchActualAttendanceDetails = async () => {
      if (!session?.actualAttendance) return;

      try {
        // Fetch details for each beneficiary in actual attendance
        const attendanceInfo = await Promise.all(
          session.actualAttendance.map(async (bene) => {
            const response = await fetch(
              `https://vac-net-backend.vercel.app/beneficiary/id?id=${bene}`,
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
          }),
        );

        // Update the state with the fetched beneficiary details
        setDetailedActualAttendance(attendanceInfo); // You might need a different state variable here if expected and actual attendance are supposed to be independent
      } catch (error) {
        console.error("Error fetching actual attendance details:", error);
      }
    };

    if (session?.actualAttendance) {
      fetchActualAttendanceDetails();
    }
  }, [session, notifyChange]); // Ensure dependency on the correct session property

  useEffect(() => {
    const fetchBeneficiariesAndStaff = async () => {
      const beneData = await fetch(
        "https://vacnet-backend-deploy.vercel.app/beneficiary/all",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res: Response) => res.json() as unknown as Beneficiary[]);

      const staffData = await fetch(
        "https://vacnet-backend-deploy.vercel.app/user/allstaff",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res: Response) => res.json() as unknown as Staff[]);

      setBeneficiaries(beneData);
      setStaff(staffData);
    };

    void fetchBeneficiariesAndStaff();
  }, []);

  const handleSelectBeneficiary = async (beneId: string) => {
    if (!session?._id) return;
    const updatedExpectedAttendance = [
      ...(session.expectedAttendance || []),
      beneId,
    ];
    const updatedSession = {
      ...session,
      expectedAttendance: updatedExpectedAttendance,
    };

    try {
      const res = await fetch(`https://vac-net-backend.vercel.app/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSession),
      }).then((res: Response) => res.json() as unknown as Session);
      setSession(res);
      setNotifyChange(!notifyChange);
    } catch (error) {
      console.error("Error adding beneficiary to session:", error);
    }
  };

  const handleSelectActualAttendance = async (beneId: string) => {
    if (!session?._id) return;
    const updatedActualAttendance = [
      ...(session.actualAttendance || []),
      beneId,
    ];
    const updatedSession = {
      ...session,
      actualAttendance: updatedActualAttendance,
    };

    try {
      const res = await fetch(`https://vac-net-backend.vercel.app/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSession),
      }).then((res: Response) => res.json() as unknown as Session);
      console.log(res);
      setSession(res);
      setNotifyChange(!notifyChange);
    } catch (error) {
      console.error("Error adding beneficiary to session:", error);
    }
  };

  const handleSelectStaff = async (staffId: string) => {
    if (!session?._id) return;

    const updatedStaff = [...(session.associatedStaff || []), staffId];
    const updatedSession = { ...session, associatedStaff: updatedStaff };

    try {
      const res = await fetch(`https://vac-net-backend.vercel.app/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSession),
      }).then((res: Response) => res.json() as unknown as Session);

      setSession(res);
      setNotifyChange(!notifyChange);
    } catch (err) {
      console.error("Error adding staff to session:", err);
    }
  };

  const handleRemoveBeneficiary = async (beneId: string) => {
    if (!session?._id) return;

    const updatedBeneficiaries = session.expectedAttendance?.filter(
      (bene) => bene !== beneId,
    );

    const updatedSession = {
      ...session,
      expectedAttendance: updatedBeneficiaries,
    };

    try {
      const res = await fetch(`https://vac-net-backend.vercel.app/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSession),
      }).then((res: Response) => res.json() as unknown as Session);

      setSession(res);
      setNotifyChange(!notifyChange);
    } catch (error) {
      console.error("Error removing beneficiary from session:", error);
    }
  };
  const handleRemoveActualAttendance = async (beneId: string) => {
    if (!session?._id) return;

    const updatedActualAttendance = session.actualAttendance?.filter(
      (bene) => bene !== beneId,
    );

    const updatedSession = {
      ...session,
      actualAttendance: updatedActualAttendance,
    };

    try {
      const res = await fetch(`https://vac-net-backend.vercel.app/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSession),
      }).then((res: Response) => res.json() as unknown as Session);

      setSession(res);
      setNotifyChange(!notifyChange); // Using a toggle to force re-render might not be necessary if states are updated correctly
    } catch (error) {
      console.error("Error removing beneficiary from session:", error);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!session?._id) return;

    const updatedStaff = session.associatedStaff?.filter(
      (staff) => staff !== staffId,
    );

    const updatedSession = { ...session, associatedStaff: updatedStaff };

    try {
      const res = await fetch(`https://vac-net-backend.vercel.app/session`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSession),
      }).then((res: Response) => res.json() as unknown as Session);

      setSession(res);
      setNotifyChange(!notifyChange);
    } catch (error) {
      console.error("Error removing staff from session:", error);
    }
  };

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
    // @ts-expect-error TODO
    setSession({ ...session, [field]: e.target.value });
  };

  const handleSaveSession = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      toast.promise(
        async () => {
          const res = await fetch(
            `https://vacnet-backend-deploy.vercel.app/session`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(session),
            },
          ).then((res) => res.json() as unknown as Session);

          setSession(res);
          navigate(`/app/sessions`);
          return res;
        },
        {
          loading: "Saving session...",
          success: "Session successfully saved",
          error: "Error saving session",
        },
      );
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
              // @ts-expect-error TODO
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

          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2">
              <div className="mb-4">
                <Label htmlFor="expectedAttendance">Expected Attendance</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-2 shadow-none">
                      <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[200px]"
                    forceMount
                  >
                    <DropdownMenuLabel>Choose a Beneficiary</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {beneficiaries.map((bene, index) => (
                      <DropdownMenuItem
                        key={bene._id ?? `loan-fallback-${index}`}
                        onClick={() =>
                          bene._id && handleSelectBeneficiary(bene._id)
                        }
                      >
                        {`Name: ${
                          bene.firstName
                            ? bene.firstName + " " + bene.lastName
                            : "Not specified"
                        }`}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Table>
                <TableCaption>Expected Attendance</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedBeneficiaries.map((bene) => (
                    <TableRow key={bene._id}>
                      <TableCell>{bene.firstName ?? "Not specified"}</TableCell>
                      <TableCell>{bene.lastName ?? "Not specified"}</TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            handleRemoveBeneficiary(bene._id ?? "")
                          }
                          aria-label="Remove Beneficiary"
                        >
                          <Icons.close />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Actual Attendance Section */}
            <div className="w-full md:w-1/3 px-2">
              <div className="mb-4">
                <Label htmlFor="actualAttendance">Actual Attendance</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-2 shadow-none">
                      <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[200px]"
                    forceMount
                  >
                    <DropdownMenuLabel>Choose a Beneficiary</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {detailedBeneficiaries.map((bene, index) => (
                      <DropdownMenuItem
                        key={bene._id ?? `attendance-fallback-${index}`}
                        onClick={() =>
                          bene._id && handleSelectActualAttendance(bene._id)
                        }
                      >
                        {`Name: ${
                          bene.firstName
                            ? bene.firstName + " " + bene.lastName
                            : "Not specified"
                        }`}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Table>
                <TableCaption>Actual Attendance</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedActualAttendance.map((bene) => (
                    <TableRow key={bene._id}>
                      <TableCell>{bene.firstName ?? "Not specified"}</TableCell>
                      <TableCell>{bene.lastName ?? "Not specified"}</TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            handleRemoveActualAttendance(bene._id ?? "")
                          }
                          aria-label="Remove Beneficiary"
                        >
                          <Icons.close />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Associated Staff Section */}
            <div className="w-full md:w-1/3 px-2">
              <div className="mb-4">
                <Label htmlFor="associatedStaff">Associated Staff</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-2 shadow-none">
                      <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[200px]"
                    forceMount
                  >
                    <DropdownMenuLabel>Choose a Staff Member</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {staff.map((staffMember, index) => (
                      <DropdownMenuItem
                        key={staffMember._id ?? `staff-fallback-${index}`}
                        onClick={() =>
                          staffMember._id && handleSelectStaff(staffMember._id)
                        }
                      >
                        {`Name: ${
                          staffMember.firstName
                            ? staffMember.firstName + " " + staffMember.lastName
                            : "Not specified"
                        }`}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Table>
                <TableCaption>Associated Staff</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedStaff.map((staffMember) => (
                    <TableRow key={staffMember._id}>
                      <TableCell>
                        {staffMember.firstName ?? "Not specified"}
                      </TableCell>
                      <TableCell>
                        {staffMember.lastName ?? "Not specified"}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            handleRemoveStaff(staffMember._id ?? "")
                          }
                          aria-label="Remove Staff Member"
                        >
                          <Icons.close />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default SessionEdit;
