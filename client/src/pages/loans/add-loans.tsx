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

export function AddLoan({
    notify,
    setNotify,
}: {
    notify: boolean;
    setNotify: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [borrower, setBorrower] = useState("");
    const [nextRepaymentDate, setNextRepaymentDate] = useState("");
    const [outstandingBalance, setOutstandingBalance] = useState("");
    const [paymentHistory, setPaymentHistory] = useState("");

    const handleAddLoan = async () => {
        //TODO
    };

    return (
        <>
            {/* temp code */}
        </>
    );
}

