import React, { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { useParams, useSearchParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { type Beneficiary as BeneType } from "@/pages/beneficiaries/beneficiaries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Loan } from "../loans/loans";
import { Session } from "../sessions/sessions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const Beneficiary = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [beneficiary, setBeneficiary] = useState<BeneType | null>(null);
  const [beneName, setBeneName] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [detailedLoans, setDetailedLoans] = useState<Loan[]>([]);
  const [detailedSessions, setDetailedSessions] = useState<Session[]>([]);

  const handleSaveBeneficiary = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        await fetch(
          `http://localhost:3001/beneficiary?_id=${beneficiary?._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(beneficiary),
          },
        ).then((res: Response) => res.json() as unknown as BeneType);
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
    // Fetch sessions and loans when the component mounts
    const fetchSessionsAndLoans = async () => {
      const sessionsData = await fetch('http://localhost:3001/session/sessions').then(res => res.json());
      const loansData = await fetch('http://localhost:3001/loan/getall').then(res => res.json());
      setSessions(sessionsData);
      setLoans(loansData);
    };
    fetchSessionsAndLoans();
  }, []);

  useEffect(() => {
    const getBeneficiaryById = async () => {
      setIsLoading(true);
      try {
        const res: BeneType = await fetch(
          `http://localhost:3001/beneficiary/id/?id=${id}`,
        ).then((res: Response) => res.json() as unknown as BeneType);
        setBeneficiary(res);
        setBeneName(res.firstName + " " + res.lastName);
        console.log(res);
      } catch (error) {
        // TODO: add beneficiary not found state
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void getBeneficiaryById();
  }, [id, editing]);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      // Check if there are associated loans to fetch
      if (beneficiary?.associatedLoans?.length) {
        try {
          // Fetch details for each associated loan
          const loansInfo = await Promise.all(
            beneficiary.associatedLoans.map(async (loanId) => {
              const response = await fetch(`http://localhost:3001/loan?id=${loanId}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return await response.json();
            })
          );

          // Update the state with the fetched loan details
          setDetailedLoans(loansInfo);
        } catch (error) {
          console.error("Error fetching loan details:", error);
        }
      }
    };

    // Call fetchLoanDetails if there are associated loan IDs
    if (beneficiary?.associatedLoans?.length) {
      fetchLoanDetails();
    }
  }, [beneficiary?.associatedLoans]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      // Check if there are associated sessions to fetch
      if (beneficiary?.associatedSessions?.length) {
        try {
          // Fetch details for each associated session
          const sessionsInfo = await Promise.all(
            beneficiary.associatedSessions.map(async (sessionId) => {
              const response = await fetch(`http://localhost:3001/session/${sessionId}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return await response.json();
            })
          );

          // Update the state with the fetched session details
          setDetailedSessions(sessionsInfo);
        } catch (error) {
          console.error("Error fetching session details:", error);
        }
      }
    };

    // Call fetchSessionDetails if there are associated session IDs
    if (beneficiary?.associatedSessions?.length) {
      fetchSessionDetails();
    }
  }, [beneficiary?.associatedSessions]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary({ ...beneficiary, firstName: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary({ ...beneficiary, lastName: e.target.value });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeneficiary({ ...beneficiary, phoneNumber: e.target.value });
  };

  const handleCurrentSavingsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBeneficiary({
      ...beneficiary,
      currentSavings: parseInt(e.target.value),
    });
  };

  const handleCurrentSpendingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBeneficiary({
      ...beneficiary,
      currentSpending: parseInt(e.target.value),
    });
  };

  // Function to update beneficiary with associated loan
  const handleSelectLoan = async (loanId: string) => {
    if (!beneficiary || !beneficiary._id) return;
    // Assuming the backend expects an array of loan IDs for association
    const updatedLoans = [...(beneficiary.associatedLoans || []), loanId];
    const updatedBeneficiary = { ...beneficiary, associatedLoans: updatedLoans };

    try {
      const response = await fetch(`http://localhost:3001/beneficiary/${beneficiary._id}/loans/${loanId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBeneficiary),
      });
      if (!response.ok) throw new Error("Failed to associate loan with beneficiary");
      // Optionally, fetch updated beneficiary or set state directly
      setBeneficiary(await response.json());
      const newLoanDetails = await fetch(`http://localhost:3001/loan?id=${loanId}`).then(res => res.json());
      setDetailedLoans(prevLoans => [...prevLoans, newLoanDetails]);
    } catch (error) {
      console.error("Error associating loan with beneficiary:", error);
    }
  };

  // Function to update beneficiary with associated session
  const handleSelectSession = async (sessionId: string) => {
    if (!beneficiary || !beneficiary._id) return;
    const updatedSessions = [...(beneficiary.associatedSessions || []), sessionId];
    const updatedBeneficiary = { ...beneficiary, associatedSessions: updatedSessions };

    try {
      const response = await fetch(`http://localhost:3001/beneficiary/${beneficiary._id}/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBeneficiary),
      });
      if (!response.ok) throw new Error("Failed to associate session with beneficiary");

      const newSessionDetails = await fetch(`http://localhost:3001/session/${sessionId}`).then(res => res.json());
      setDetailedSessions(prevSessions => [...prevSessions, newSessionDetails]);

      // Update the beneficiary with the newly associated session
      setBeneficiary(await response.json());
    } catch (error) {
      console.error("Error associating session with beneficiary:", error);
    }
  };

  const handleRemoveLoan = async (loanId: string) => {
    if (!beneficiary) return; // Add null check for beneficiary
    const response = await fetch(`http://localhost:3001/beneficiary/${beneficiary._id}/loans/${loanId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // Remove the loan from the detailedLoans state to update UI
      setDetailedLoans(prevLoans => prevLoans.filter(loan => loan._id !== loanId));
      // Use functional update to ensure we're not relying on stale state
      setBeneficiary(prev => {
        if (!prev) return null;
        return {
          ...prev,
          associatedLoans: prev.associatedLoans ? prev.associatedLoans.filter(id => id !== loanId) : [],
        };
      });
    } else {
      console.error("Failed to remove the loan");
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    if (!beneficiary) return; // Add null check for beneficiary

    const response = await fetch(`http://localhost:3001/beneficiary/${beneficiary._id}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setBeneficiary(prev => {
        if (!prev) return null;
        return {
          ...prev,
          associatedSessions: prev.associatedSessions ? prev.associatedSessions.filter(id => id !== sessionId) : [],
        };
      });
      // Remove the session from the detailedSessions state to update UI
      setDetailedSessions(prevSessions => prevSessions.filter(session => session._id !== sessionId));
    } else {
      console.error("Failed to remove the session");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading={beneName ? beneName : "Beneficiary"}
        text={
          "View and edit " +
          (beneName ? beneName : "this beneficiary") +
          "'s data"
        }
      >
        <div>
          <SaveBeneficiary
            isLoading={isLoading}
            editing={params.get("f") === "1"}
            onClick={handleSaveBeneficiary}
          />
          {params.get("f") === "1" && (
            <button
              className={buttonVariants({ variant: "outline" })}
              onClick={() => setParams({ f: "0" })}
            >
              <Icons.close className="mr-2 h-4 w-4" />
              Cancel
            </button>
          )}
        </div>
      </DashboardHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            First Name
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={beneficiary?.firstName}
            onChange={handleFirstNameChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Last Name
          </Label>
          <Input
            id="lname"
            className="col-span-1 pr-1"
            value={beneficiary?.lastName}
            onChange={handleLastNameChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Phone Number
          </Label>
          <Input
            id="pnum"
            type="number"
            className="col-span-1"
            value={beneficiary?.phoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        {beneficiary?.birthday && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Birth Date
            </Label>
            <DatePicker
              date={beneficiary?.birthday}
            // setDate={handleBirthDateChange}
            />
          </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Current Savings
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.currentSavings}
            onChange={handleCurrentSavingsChange}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Current Spending
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            value={beneficiary?.currentSpending}
            onChange={handleCurrentSpendingChange}
            disabled={params.get("f") !== "1"}
          />
        </div>

        {editing && (
          <div className="flex flex-row justify-between">
            <Label htmlFor="loans" className="text-left">
              Associated Loans
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
                <DropdownMenuLabel>Choose a Loan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {loans.map((loan, index) => (
                  <DropdownMenuItem
                    key={loan._id ?? `loan-fallback-${index}`}
                    onClick={() => loan._id && handleSelectLoan(loan._id)}
                  >
                    {`Payment: ${loan.initialPayment ?? 'Not specified'} - Date: ${loan.initialPaymentDate
                      ? new Date(loan.initialPaymentDate).toLocaleDateString()
                      : 'Not specified'
                      } - Status: ${loan.loanStatus ?? 'Not specified'}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Label htmlFor="sessions" className="text-left">
              Associated Sessions
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
                <DropdownMenuLabel>Choose a Session</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sessions.map(session => (
                  <DropdownMenuItem key={session._id} onClick={() => handleSelectSession(session._id)}>
                    {`${new Date(session.sessionDate).toLocaleDateString()} - ${session.region}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>)}

        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <Table>
              <TableCaption>Associated Loans</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Initial Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedLoans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell>{loan.initialPayment ?? 'Not specified'}</TableCell>
                    <TableCell>{
                      loan.initialPaymentDate
                        ? new Date(loan.initialPaymentDate).toLocaleDateString()
                        : 'Not specified'
                    }</TableCell>
                    <TableCell>{loan.loanStatus ?? 'Not specified'}</TableCell>
                    <TableCell>
                      {editing && (
                        <button onClick={() => handleRemoveLoan(loan._id)} aria-label="Remove loan">
                          <Icons.close />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="w-full md:w-1/2 px-2">
            <Table>
              <TableCaption>Associated Sessions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedSessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell>{
                      session.sessionDate
                        ? new Date(session.sessionDate).toLocaleDateString()
                        : 'Not specified'
                    }</TableCell>
                    <TableCell>{session.region ?? 'Not specified'}</TableCell>
                    <TableCell>
                      {editing && (
                        <button onClick={() => handleRemoveSession(session._id)} aria-label="Remove session">
                          <Icons.close />
                        </button>)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
};

export default Beneficiary;


const SaveBeneficiary = ({
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
      {editing ? "Save Changes" : "Edit Beneficiary"}
    </button>
  );
};
