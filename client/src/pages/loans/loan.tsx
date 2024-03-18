import React, { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Beneficiary } from "../beneficiaries/beneficiaries";
import { useSearchParams } from "react-router-dom";

export interface Loan {
  _id?: string;
  initialPayment?: number;
  initialPaymentDate?: string;
  principalLeft?: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  paymentFrequency?: string;
  archivedLoan?: boolean;
  beneficiary?: Beneficiary;
  validLoan?: boolean;
  loanStatus?: string;
}
const Loan = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Loan,
  ) => {
    setLoan({ ...loan, [field]: e.target.value });
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Loan,
  ) => {
    setLoan({ ...loan, [field]: e.target.checked });
  };

  const handleSaveLoan = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        await fetch(`https://vacnet-backend-deploy.vercel.app/loan`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loan),
        }).then((res: Response) => res.json() as unknown as Loan);
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
  const formatDateForInput = (date: Date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = (date.getDate() + 1).toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const getLoanById = async () => {
      setIsLoading(true);
      try {
        const res: Loan = await fetch(`http://localhost:3001/loan/${id}`).then(
          (res: Response) => res.json() as unknown as Loan,
        );
        res.initialPaymentDate = formatDateForInput(
          new Date(res.initialPaymentDate ?? ""),
        );
        res.nextPaymentDate = formatDateForInput(
          new Date(res.nextPaymentDate ?? ""),
        );
        setLoan(res);
        console.log(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    void getLoanById();
  }, [editing]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Loans"
        text="View and modify your loan details here."
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
      {loan && (
        <div className="py-4 flex justify-between">
          <div className="w-1/2 pl-4 pr-10">
            <div className="mb-4">
              <Label htmlFor="initialPayment">Initial Payment</Label>
              <Input
                type="number"
                id="initialPayment"
                value={loan.initialPayment}
                onChange={(e) => handleChange(e, "initialPayment")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="initialPaymentDate">Initial Payment Date</Label>
              <Input
                type="date"
                id="initialPaymentDate"
                value={loan.initialPaymentDate}
                onChange={(e) => handleChange(e, "initialPaymentDate")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="principalLeft">Principal Left</Label>
              <Input
                type="number"
                id="principalLeft"
                value={loan.principalLeft}
                onChange={(e) => handleChange(e, "principalLeft")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="nextPaymentAmount">Next Payment</Label>
              <Input
                type="number"
                id="nextPaymentAmount"
                value={loan.nextPaymentAmount}
                onChange={(e) => handleChange(e, "nextPaymentAmount")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
              <Input
                type="date"
                id="nextPaymentDate"
                value={loan.nextPaymentDate}
                onChange={(e) => handleChange(e, "nextPaymentDate")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="paymentFrequency">Payment Frequency</Label>
              <Input
                type="string"
                id="paymentFrequency"
                value={loan.paymentFrequency}
                onChange={(e) => handleChange(e, "paymentFrequency")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="loanStatus">Loan Status</Label>
              <Input
                type="string"
                id="loanStatus"
                value={loan.loanStatus}
                onChange={(e) => handleChange(e, "loanStatus")}
                disabled={params.get("f") !== "1"}
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="archivedLoan"
                checked={loan.archivedLoan}
                onChange={(e) => handleCheckboxChange(e, "archivedLoan")}
                disabled={params.get("f") !== "1"}
                className="mr-2"
              />
              <Label htmlFor="archived">Archived</Label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="validLoan"
                checked={loan.validLoan}
                onChange={(e) => handleCheckboxChange(e, "validLoan")}
                disabled={params.get("f") !== "1"}
                className="mr-2"
              />
              <Label htmlFor="archived">Valid Loan</Label>
            </div>
          </div>
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl mb-4">Beneficiary</h2>
            <div className="mb-4">
              <Label htmlFor="beneficiary">First Name</Label>
              <Input
                type="string"
                id="firstName"
                value={loan.beneficiary?.firstName}
                disabled={true}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="beneficiary">Last Name</Label>
              <Input
                type="string"
                id="lastName"
                value={loan.beneficiary?.lastName}
                disabled={true}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="beneficiary">Phone Number</Label>
              <Input
                type="string"
                id="phoneNumber"
                value={loan.beneficiary?.phoneNumber}
                disabled={true}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="beneficiary">Current Savings</Label>
              <Input
                type="number"
                id="currentSavings"
                value={loan.beneficiary?.currentSavings}
                disabled={true}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="beneficiary">Current Spending</Label>
              <Input
                type="number"
                id="currentSpending"
                value={loan.beneficiary?.currentSpending}
                disabled={true}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default Loan;
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
