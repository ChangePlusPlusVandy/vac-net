//imports here
import { BellIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import type { Loan } from "@/pages/loans/loans";
import { Icons } from "../ui/icons";
import { useNavigate } from "react-router-dom";

const LoanCard = ({ loan }: { loan: Loan }) => {
  const navigate = useNavigate();

  const getBeneficiaryName = () => {
    if (!loan.beneficiary) return "No beneficiary";
    return loan.beneficiary?.firstName + " " + loan.beneficiary?.lastName;
  };

  const getLoanStatus = () => {
    if (!loan.loanStatus) return "No Loan";

    return loan.loanStatus;
  };

  return (
    <Card
      className="cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
      onClick={() => navigate(`./${loan._id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{getBeneficiaryName()}</CardTitle>
        <CardDescription className="text-sm">({loan._id})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <Badge
            className="flex items-center"
            variant={
              getLoanStatus() === "Delinquient"
                ? "destructive"
                : getLoanStatus() === "No Loan"
                ? "secondary"
                : getLoanStatus() === "Fully Paid Off"
                ? "default"
                : getLoanStatus() === "Pending Approval"
                ? "default"
                : "default"
            }
          >
            <BellIcon className="mr-1 h-3 w-3" />
            {getLoanStatus()}
          </Badge>
          <div className="flex items-center">
            <Icons.dolla className="mr-1 h-3 w-3" />
            {loan.initialPayment || 0}
          </div>
          {loan.beneficiary?.phoneNumber?.length ?? 0 > 0 ? (
            <div className="truncate">#: {loan.beneficiary?.phoneNumber} </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
export default LoanCard;
