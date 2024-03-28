import React, { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { useParams, useSearchParams } from "react-router-dom";
import { buttonVariants, Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { type Beneficiary as BeneType } from "@/pages/beneficiaries/beneficiaries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { type Loan } from "../loans/loans";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
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
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [openLoans, setOpenLoans] = React.useState(false);

  const handleSaveBeneficiary = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        toast.promise(
          async () => {
            await fetch(
              `https://vacnet-backend-deploy.vercel.app/beneficiary?_id=${beneficiary?._id}`,
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
          },
          {
            loading: "Saving Beneficiary...",
            success: () => {
              return `Saved ${beneficiary?.firstName}`;
            },
          },
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong saving the beneficiary", {
          description: (err as Error).message,
        });
      }
    } else {
      setParams({ f: "1" });
      setEditing(true);
    }
  };

  useEffect(() => {
    // Fetch sessions and loans when the component mounts
    const fetchSessionsAndLoans = async () => {
      const sessionsData = await fetch(
        "https://vacnet-backend-deploy.vercel.app/session/sessions",
      ).then((res) => res.json());

      const loansData = await fetch(
        "https://vacnet-backend-deploy.vercel.app/loan/getall",
      ).then((res) => res.json());
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
              const response = await fetch(
                `http://localhost:3001/loan?id=${loanId}`,
              );
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return await response.json();
            }),
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
              const response = await fetch(
                `http://localhost:3001/session/${sessionId}`,
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
    if (!beneficiary?._id) return;
    // Assuming the backend expects an array of loan IDs for association
    const updatedLoans = [...(beneficiary.associatedLoans || []), loanId];
    const updatedBeneficiary = {
      ...beneficiary,
      associatedLoans: updatedLoans,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/beneficiary/${beneficiary._id}/loans/${loanId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBeneficiary),
        },
      );
      if (!response.ok)
        throw new Error("Failed to associate loan with beneficiary");
      // Optionally, fetch updated beneficiary or set state directly
      setBeneficiary(await response.json());
      const newLoanDetails = await fetch(
        `http://localhost:3001/loan?id=${loanId}`,
      ).then((res) => res.json());
      setDetailedLoans((prevLoans) => [...prevLoans, newLoanDetails]);
    } catch (error) {
      console.error("Error associating loan with beneficiary:", error);
    }
  };

  // Function to update beneficiary with associated session
  const handleSelectSession = async (sessionId: string) => {
    if (!beneficiary?._id) return;
    const updatedSessions = [
      ...(beneficiary.associatedSessions || []),
      sessionId,
    ];
    const updatedBeneficiary = {
      ...beneficiary,
      associatedSessions: updatedSessions,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/beneficiary/${beneficiary._id}/sessions/${sessionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBeneficiary),
        },
      );
      if (!response.ok)
        throw new Error("Failed to associate session with beneficiary");

      const newSessionDetails = await fetch(
        `http://localhost:3001/session/${sessionId}`,
      ).then((res) => res.json());
      setDetailedSessions((prevSessions) => [
        ...prevSessions,
        newSessionDetails,
      ]);

      // Update the beneficiary with the newly associated session
      setBeneficiary(await response.json());
    } catch (error) {
      console.error("Error associating session with beneficiary:", error);
    }
  };

  const handleRemoveLoan = async (loanId: string) => {
    if (!beneficiary) return; // Add null check for beneficiary
    const response = await fetch(
      `http://localhost:3001/beneficiary/${beneficiary._id}/loans/${loanId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      // Remove the loan from the detailedLoans state to update UI
      setDetailedLoans((prevLoans) =>
        prevLoans.filter((loan) => loan._id !== loanId),
      );
      // Use functional update to ensure we're not relying on stale state
      setBeneficiary((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          associatedLoans: prev.associatedLoans
            ? prev.associatedLoans.filter((id) => id !== loanId)
            : [],
        };
      });
    } else {
      console.error("Failed to remove the loan");
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    if (!beneficiary) return; // Add null check for beneficiary

    const response = await fetch(
      `http://localhost:3001/beneficiary/${beneficiary._id}/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      setBeneficiary((prev) => {
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
            First Name
          </Label>
          <Input
            id="fname"
            className="col-span-1"
            value={beneficiary?.firstName}
            onChange={handleFirstNameChange}
            disabled={params.get("f") !== "1"}
          />
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
          <Label htmlFor="name" className="text-left">
            Age
          </Label>
          <Input
            id="lname"
            type="number"
            className="col-span-1 pr-1"
            value={beneficiary?.age}
            onChange={(e) =>
              setBeneficiary({ ...beneficiary, age: parseInt(e.target.value) })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Current Savings (UGX)
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.currentSavings}
            onChange={handleCurrentSavingsChange}
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            Current Spending (UGX)
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            type="number"
            value={beneficiary?.currentSpendingInUGX}
            onChange={handleCurrentSpendingChange}
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Total Children
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            type="number"
            value={beneficiary?.children}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                children: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            Number of children with shoes
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            type="number"
            value={beneficiary?.childrenWithShoes}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                childrenWithShoes: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            # of people in household
          </Label>
          <Input
            id="currsavings"
            type="number"
            className="col-span-1"
            value={beneficiary?.peopleInHousehold}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                peopleInHousehold: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            # of financial dependents
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            type="number"
            value={beneficiary?.numFinancialDependents}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                numFinancialDependents: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Do you own your house?
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.ownYourHouse}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                ownYourHouse: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            How many rooms in your house?
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            type="number"
            value={beneficiary?.howManyRoomsInHouse}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                howManyRoomsInHouse: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            House Roof Material
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.roofMaterial}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                roofMaterial: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            House Wall Material
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            value={beneficiary?.wallMaterial}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                wallMaterial: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            House Floor Material
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.floorMaterial}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                floorMaterial: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            House Light Source
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            value={beneficiary?.lightSource}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                lightSource: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Highest Education Level
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.highestEducationLevel}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                highestEducationLevel: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            Cows Owned
          </Label>
          <Input
            id="currspending"
            type="number"
            className="col-span-1"
            value={beneficiary?.cows}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                cows: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Goats Owned
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.goats}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                goats: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            Chickens Owned
          </Label>
          <Input
            id="currspending"
            type="number"
            className="col-span-1"
            value={beneficiary?.chickens}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                chickens: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Turkeys Owned
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.turkeys}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                turkeys: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            Other Livestock?
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            value={beneficiary?.otherLivestock}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                otherLivestock: e.target.value,
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            How many meals per day?
          </Label>
          <Input
            id="currsavings"
            className="col-span-1"
            value={beneficiary?.howManyMealsPerDay}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                howManyMealsPerDay: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
          <Label htmlFor="name" className="text-left">
            How many employees?
          </Label>
          <Input
            id="currspending"
            className="col-span-1"
            value={beneficiary?.howManyEmployees}
            onChange={(e) =>
              setBeneficiary({
                ...beneficiary,
                howManyEmployees: parseInt(e.target.value),
              })
            }
            disabled={params.get("f") !== "1"}
          />
        </div>

        <div className="flex flex-row justify-between">
          <Label htmlFor="loans" className="text-left">
            Associated Loans
          </Label>

          {/* {editing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  Choose loans to add
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className="w-[500px]"
                forceMount
              >
                <DropdownMenuLabel>Choose a Loan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {loans.map((loan, index) => (
                  <DropdownMenuItem
                    key={loan._id ?? `loan-fallback-${index}`}
                    onClick={() => loan._id && handleSelectLoan(loan._id)}
                  >
                    {`Payment: ${loan.initialPayment ?? "Not specified"
                      } - Date: ${loan.initialPaymentDate
                        ? new Date(loan.initialPaymentDate).toLocaleDateString()
                        : "Not specified"
                      } - Status: ${loan.loanStatus ?? "Not specified"}`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>)} */}

          {editing && (
            <Popover open={openLoans} onOpenChange={setOpenLoans}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
                  className="px-2 shadow-none justify-between"
                >
                  {"Choose loans to add"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px]">
                <Command>
                  <CommandInput placeholder="Search loans..." />
                  <CommandEmpty>No loans found.</CommandEmpty>
                  <CommandGroup>
                    {loans.map((loan) => (
                      <CommandItem
                        key={loan._id}
                        value={`Payment: ${
                          loan.initialPayment ?? "Not specified"
                        } - Date: ${
                          loan.initialPaymentDate
                            ? new Date(
                                loan.initialPaymentDate,
                              ).toLocaleDateString()
                            : "Not specified"
                        } - Status: ${loan.loanStatus ?? "Not specified"}`}
                        onSelect={() => {
                          void handleSelectLoan(loan._id ?? "");
                          setValue(
                            `Payment: ${
                              loan.initialPayment ?? "Not specified"
                            } - Date: ${
                              loan.initialPaymentDate
                                ? new Date(
                                    loan.initialPaymentDate,
                                  ).toLocaleDateString()
                                : "Not specified"
                            } - Status: ${loan.loanStatus ?? "Not specified"}`,
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === loan._id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {`Payment: ${
                          loan.initialPayment ?? "Not specified"
                        } - Date: ${
                          loan.initialPaymentDate
                            ? new Date(
                                loan.initialPaymentDate,
                              ).toLocaleDateString()
                            : "Not specified"
                        } - Status: ${loan.loanStatus ?? "Not specified"}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          <Label htmlFor="sessions" className="text-left">
            Associated Sessions
          </Label>
          {editing && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
                  className="px-2 shadow-none justify-between"
                >
                  {"Choose sessions to add"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px]">
                <Command>
                  <CommandInput placeholder="Search sessions by region..." />
                  <CommandEmpty>No sessions found.</CommandEmpty>
                  <CommandGroup>
                    {sessions.map((session) => (
                      <CommandItem
                        key={session._id}
                        value={`${new Date(
                          session.sessionDate,
                        ).toLocaleDateString()} - ${session.region}`}
                        onSelect={() => {
                          handleSelectSession(session._id);
                          setValue(
                            `${new Date(
                              session.sessionDate,
                            ).toLocaleDateString()} - ${session.region}`,
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === session._id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {`${new Date(
                          session.sessionDate,
                        ).toLocaleDateString()} - ${session.region}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
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
                    <TableCell>
                      {loan.initialPayment ?? "Not specified"}
                    </TableCell>
                    <TableCell>
                      {loan.initialPaymentDate
                        ? new Date(loan.initialPaymentDate).toLocaleDateString()
                        : "Not specified"}
                    </TableCell>
                    <TableCell>{loan.loanStatus ?? "Not specified"}</TableCell>
                    <TableCell>
                      {editing && (
                        <button
                          // @ts-expect-error TODO
                          onClick={() => handleRemoveLoan(loan._id)}
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
