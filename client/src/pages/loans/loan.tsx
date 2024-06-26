import React, { useEffect, useState, type ChangeEvent } from "react";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { useParams, useSearchParams } from "react-router-dom";
import { buttonVariants, Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { type Loan } from "@/pages/loans/loans";
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
import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { type Beneficiary } from "../beneficiaries/beneficiaries";
import { type Session } from "../sessions/sessions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
const LoanPage = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loanName, setLoanName] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [detailedBeneficiaries, setDetailedBeneficiaries] = useState<
    Beneficiary[]
  >([]);
  const [detailedSessions, setDetailedSessions] = useState<Session[]>([]);

  const handleSaveLoan = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        toast.promise(
          async () => {
            const res = await fetch(
              `https://vacnet-backend-deploy.vercel.app/loan`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(loan),
              },
            ).then((res: Response) => res.json() as unknown as Loan);
            setEditing(false);
            setParams({ f: "0" });
            return res;
          },
          {
            loading: "Saving loan...",
            success: "Loan successfully saved!",
            error: "Error saving loan",
          },
        );
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
    const fetchBenesAndSessions = async () => {
      const sessionsData = await fetch(
        "https://vacnet-backend-deploy.vercel.app/session/sessions",
      ).then((res) => res.json());

      const beneData = await fetch(
        "https://vacnet-backend-deploy.vercel.app/beneficiary/all",
      ).then((res) => res.json());
      setSessions(sessionsData);
      setBeneficiaries(beneData);
    };
    fetchBenesAndSessions();
  }, []);

  // Helper function to format the date to YYYY-MM-DD
  const formatDateForInput = (date: Date) => {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };

  useEffect(() => {
    const getLoanById = async () => {
      setIsLoading(true);
      try {
        const res: Loan = await fetch(
          `https://vac-net-backend.vercel.app/loan/?id=${id}`,
        ).then((res: Response) => res.json() as unknown as Loan);
        // @ts-expect-error TODO 
        res.nextPaymentDate = formatDateForInput(
          new Date(res.nextPaymentDate ?? ""),
        );
        setLoan(res);
        setLoanName(
          res.beneficiaries?.length
            ? "Loan for " +
                res.beneficiaries
                  .map((b) => b.firstName + " " + b.lastName)
                  .join(", ")
            : "Loan",
        );
      } catch (error) {
        // TODO: add loan not found state
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void getLoanById();
  }, [id, editing]);

  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      // Check if there are associated loans to fetch
      if (loan?.beneficiaries?.length) {
        try {
          // Fetch details for each associated loan
          const beneInfo = await Promise.all(
            loan.beneficiaries.map(async (bene) => {
              const response = await fetch(
                `https://vac-net-backend.vercel.app/beneficiary/id?id=${bene._id}`,
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
      }
    };

    // Call fetchLoanDetails if there are associated loan IDs
    if (loan?.beneficiaries?.length) {
      fetchBeneficiaryDetails();
    }
  }, [loan?.beneficiaries]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Loan,
  ) => {
    setLoan({ ...loan, [field]: e.target.value });
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      // Check if there are associated sessions to fetch
      if (loan?.associatedSessions?.length) {
        try {
          // Fetch details for each associated session
          const sessionsInfo = await Promise.all(
            loan.associatedSessions.map(async (sessionId) => {
              const response = await fetch(
                `https://vac-net-backend.vercel.app/session/${sessionId}`,
              );
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return await response.json();
            }),
          );

          // Update the state with the fetched session details
          setDetailedSessions(sessionsInfo);
        } catch (error) {
          console.error("Error fetching session details:", error);
        }
      }
    };

    // Call fetchSessionDetails if there are associated session IDs
    if (loan?.associatedSessions?.length) {
      fetchSessionDetails();
    }
  }, [loan?.associatedSessions]);

  // Function to update beneficiary with associated loan
  const handleSelectBeneficiary = async (beneId: string) => {
    if (!loan?._id) return;
    // Assuming the backend expects an array of beneficiary IDs for association
    const updatedBeneficiaries = [...(loan.beneficiaries || []), beneId];
    const updatedLoan = {
      ...loan,
      beneficiaries: updatedBeneficiaries,
    };

    try {
      const response = await fetch(
        `https://vac-net-backend.vercel.app/loan/${loan._id}/beneficiaries/${beneId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLoan),
        },
      );
      const response2 = await fetch(
        `https://vac-net-backend.vercel.app/beneficiary/${beneId}/loans/${loan._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLoan),
        },
      );
      console.log(response, response2);
      if (!response.ok)
        throw new Error("Failed to associate beneficiary with loan");
      setLoan(await response.json());
      const newBeneDetails = await fetch(
        `https://vac-net-backend.vercel.app/beneficiary/id?id=${beneId}`,
      ).then((res) => res.json());
      setDetailedBeneficiaries((prevBenes) => [...prevBenes, newBeneDetails]);
    } catch (error) {
      console.error("Error associating beneficiary with loan:", error);
    }
  };

  // Function to update beneficiary with associated session
  const handleSelectSession = async (sessionId: string) => {
    if (!loan?._id) return;
    const updatedSessions = [...(loan.associatedSessions || []), sessionId];
    const updatedLoan = {
      ...loan,
      associatedSessions: updatedSessions,
    };

    try {
      const response = await fetch(
        `https://vac-net-backend.vercel.app/loan/${loan._id}/sessions/${sessionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLoan),
        },
      );
      if (!response.ok)
        throw new Error("Failed to associate session with loan");

      const newSessionDetails = await fetch(
        `https://vac-net-backend.vercel.app/session/${sessionId}`,
      ).then((res) => res.json());
      setDetailedSessions((prevSessions) => [
        ...prevSessions,
        newSessionDetails,
      ]);

      // Update the beneficiary with the newly associated session
      setLoan(await response.json());
    } catch (error) {
      console.error("Error associating session with loan:", error);
    }
  };

  const handleRemoveBeneficiary = async (beneId: string) => {
    if (!loan) return;
    const response = await fetch(
      `https://vac-net-backend.vercel.app/loan/${loan._id}/beneficiaries/${beneId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      // Remove the beneficiary from the detailedBeneficiaries state to update UI
      setDetailedBeneficiaries((prevBenes) =>
        prevBenes.filter((b) => b._id !== beneId),
      );
      // Use functional update to ensure we're not relying on stale state
      setLoan((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          beneficiaries: prev.beneficiaries
            ? prev.beneficiaries.filter((id) => id !== beneId)
            : [],
        };
      });
    } else {
      console.error("Failed to remove the beneficiary");
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    if (!loan) return; // Add null check for beneficiary

    const response = await fetch(
      `https://vac-net-backend.vercel.app/loan/${loan._id}/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      setLoan((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          associatedSessions: prev.associatedSessions
            ? // @ts-expect-error TODO
              prev.associatedSessions.filter((id) => id !== sessionId)
            : [],
        };
      });
      // Remove the session from the detailedSessions state to update UI
      setDetailedSessions((prevSessions) =>
        prevSessions.filter((session) => session._id !== sessionId),
      );
    } else {
      console.error("Failed to remove the session");
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading={loanName ? loanName : "Loan"}
        text="View and edit this loan"
      >
        <div>
          <SaveLoan
            isLoading={isLoading}
            editing={params.get("f") === "1"}
            onClick={handleSaveLoan}
          />
          {params.get("f") === "1" && (
            <button
              className={buttonVariants({ variant: "outline" })}
              onClick={() => {
                setParams({ f: "0" });
                setEditing(false);
              }}
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
            Initial Payment
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={loan?.initialPayment}
            onChange={(e) =>
              setLoan({ ...loan, initialPayment: parseInt(e.target.value) })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            Loan Status
          </Label>
          <Input
            id="lname"
            className="col-span-1 pr-1"
            value={loan?.loanStatus}
            onChange={(e) => setLoan({ ...loan, loanStatus: e.target.value })}
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sessionDate">Next Payment</Label>
          <Input
            type="date"
            id="sessionDate"
            // @ts-expect-error TODO
            value={loan?.nextPaymentDate}
            onChange={(e) => handleChange(e, "nextPaymentDate")}
          />
          <Label htmlFor="name" className="text-left">
            Next Payment Amount
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={loan?.nextPaymentAmount}
            onChange={(e) =>
              setLoan({ ...loan, nextPaymentAmount: parseInt(e.target.value) })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        {editing && (
          <div className="flex flex-row justify-between">
            <Label htmlFor="beneficiaries" className="text-left">
              Associated Beneficiaries
            </Label>
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

            <Label htmlFor="sessions" className="text-left">
              Associated Sessions
            </Label>
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
                <DropdownMenuLabel>Choose a Session</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sessions.map((session) => (
                  <DropdownMenuItem
                    key={session._id}
                    onClick={() => handleSelectSession(session._id)}
                  >
                    {`${new Date(session.sessionDate).toLocaleDateString()} - ${
                      session.region
                    }`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <Table>
              <TableCaption>Associated Beneficiaries</TableCaption>
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
                      {editing && (
                        <button
                          // @ts-expect-error TODO
                          onClick={() => handleRemoveBeneficiary(bene._id)}
                          aria-label="Remove loan"
                        >
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
                    <TableCell>
                      {session.sessionDate
                        ? new Date(session.sessionDate).toLocaleDateString()
                        : "Not specified"}
                    </TableCell>
                    <TableCell>{session.region ?? "Not specified"}</TableCell>
                    <TableCell>
                      {editing && (
                        <button
                          onClick={() => handleRemoveSession(session._id)}
                          aria-label="Remove session"
                        >
                          <Icons.close />
                        </button>
                      )}
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

export default LoanPage;

const SaveLoan = ({
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
      {editing ? "Save Changes" : "Edit Loan"}
    </button>
  );
};
