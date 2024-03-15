//imports here
import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCreateButton } from "@/components/create-item-button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddLoan({
  notify,
  setNotify,
}: {
  notify: boolean;
  setNotify: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [initialPayment, setInitialPayment] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("");
  const [loanStatus, setLoanStatus] = useState("");

  const handleAddLoan = async () => {
    const data = {
      initialPayment,
      initialDate,
      paymentFrequency,
      loanStatus,
    };
    try {
      toast.promise(
        async () => {
          const res = await fetch(
            "https://vacnet-backend-deploy.vercel.app/loan/",
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" },
            },
          );
          setNotify(!notify);
          return res;
        },
        {
          loading: "Saving Loan...",
          success: () => {
            return "Loan successfully saved";
          },
          error: "Error adding loan",
        },
      );
    } catch (err) {
      console.log(err);
      toast.error("Error adding loan", {
        description: (err as Error).message,
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ItemCreateButton item="Add Loan" />
      </SheetTrigger>
      <SheetContent className="w-full" side="right">
        <SheetHeader>
          <SheetTitle>Add Loan</SheetTitle>
          <SheetDescription>
            You can always edit this information later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Initial Payment
            </Label>
            <Input
              id="ipayment"
              type="number"
              value={initialPayment}
              onChange={(e) => setInitialPayment(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Loan Date
            </Label>
            <Input
              id="ldate"
              type="date"
              value={initialDate}
              onChange={(e) => setInitialDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Payment Frequency
            </Label>
            <Input
              id="pfreq"
              type="string"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Loan Status
            </Label>
            <Input
              id="lstatus"
              type="string"
              value={loanStatus}
              onChange={(e) => setLoanStatus(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleAddLoan}>Save loan</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
