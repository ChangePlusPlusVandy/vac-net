import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";
import type { Loan } from "@/pages/loans/loans";
import React from "react";
import { useNavigate } from "react-router-dom";

const LoanCard = ({ loan }: { loan: Loan }) => {
  const navigate = useNavigate();

  const getBeneficiaryName = () => {
    if (!loan.beneficiaries?.length) return "No beneficiary";
    return loan.beneficiaries
      ?.map((b) => b.firstName + " " + b.lastName)
      .join(", ");
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
      <CardHeader className="grid grid-cols-[1fr_32px] items-start gap-4 space-y-0">
        <div className="mb-1">
          <CardTitle className="text-xl">{getBeneficiaryName()}</CardTitle>
          <CardDescription className="text-sm">({loan._id})</CardDescription>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
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
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Bookmark User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Edit Loan</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={(e) => {
                  e.stopPropagation();
                  if (loan?.beneficiaries?.length) {
                    navigate(
                      `../beneficiaries?f=${
                        loan?.beneficiaries[0]?.firstName ?? ""
                      }`,
                    );
                  }
                }}
              >
                View Beneficiary
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>View Sessions</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Icons.search className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
            {loan.initialPayment ?? 0}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default LoanCard;
