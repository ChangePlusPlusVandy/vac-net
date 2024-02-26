import React, { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { Beneficiary } from "../beneficiaries/beneficiaries";
import { useSearchParams } from "react-router-dom";
import { resolve } from "path";

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

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoan({ ...loan, archivedLoan: e.target.checked });
  };

  const handleSaveLoan = async () => {
    if (params.get("f") === "1") {
      setIsLoading(true);
      try {
        await fetch(
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
      } catch (err) {
        console.error(err);
      }
    } else {
      setParams({ f: "1" });
      setEditing(true);
    }
  };

  useEffect(() => {
    const getLoanById = async () => {
      setIsLoading(true);
      try {
        const res: Loan = await fetch(
          `http://localhost:3001/loan/${id}`,
        ).then((res: Response) => res.json() as unknown as Loan);
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
        heading="Edit Loans"
        text="Modify your Loan details here."
      >
        <Button onClick={handleSaveLoan} disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            <Icons.save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </DashboardHeader>
      {loan && (
        <div className="py-4">
          <div className="mb-4">
            <Label htmlFor="initialPayment">Initial Payment</Label>
            <Input
              type="number"
              id="initialPayment"
              value={loan.initialPayment}
              onChange={(e) => handleChange(e, "initialPayment")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="initialPaymentDate">Initial Payment Date</Label>
            <Input
              type="date"
              id="initialPaymentDate"
              value={loan.initialPaymentDate}
              onChange={(e) => handleChange(e, "initialPaymentDate")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="principalLeft">Principal Left</Label>
            <Input
              type="number"
              id="principalLeft"
              value={loan.principalLeft}
              onChange={(e) => handleChange(e, "principalLeft")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="nextPaymentAmount">Next Payment</Label>
            <Input
              type="number"
              id="nextPaymentAmount"
              value={loan.nextPaymentAmount}
              onChange={(e) => handleChange(e, "nextPaymentAmount")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
            <Input
              type="date"
              id="nextPaymentDate"
              value={loan.nextPaymentDate}
              onChange={(e) => handleChange(e, "nextPaymentDate")}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Input
              type="string"
              id="paymentFrequency"
              value={loan.paymentFrequency}
              onChange={(e) => handleChange(e, "paymentFrequency")}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="archivedLoan"
              checked={loan.archivedLoan}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <Label htmlFor="archived">Archived</Label>
          </div>
          <div className="mb-4">
            <Label htmlFor="beneficiary">Beneficiary</Label>
            <Input
              type="Beneficiary"
              id="beneficiary"
              value={loan.beneficiary?.firstName}
              onChange={(e) => handleChange(e, "beneficiary")}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="validLoan"
              checked={loan.validLoan}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <Label htmlFor="archived">Valid Loan</Label>
          </div>
          <div className="mb-4">
            <Label htmlFor="loanStatus">Loan Status</Label>
            <Input
              type="string"
              id="loanStatus"
              value={loan.loanStatus}
              onChange={(e) => handleChange(e, "loanStatus")}
            />
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default Loan;
