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
import type { Beneficiary } from "@/pages/beneficiaries/beneficiaries";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { type Staff } from "@/contexts/AuthContext";

const BeneficiaryCard = ({ beneficiary }: { beneficiary: Beneficiary }) => {
  const navigate = useNavigate();
  const { mongoUser, refresh, setRefresh } = useAuth();

  const getLoanStatus = () => {
    if (!beneficiary.loan) return "No Loan";

    if (beneficiary.loan?.loanStatus === "Pending Approval") {
      return "Pending";
    }

    return beneficiary.loan?.loanStatus;
  };

  const handleGoToBeneficiary = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`./${beneficiary._id}`);
  };

  const handleGoToBeneficaryEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`./${beneficiary._id}?f=1`);
  };

  const handleBookmarkBeneficiary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("bookmarking beneficiary");
    let newBookmarks;
    if (mongoUser?.bookmarkedBeneficiaries?.includes(beneficiary._id ?? "")) {
      // We need to remove bookmark
      newBookmarks = mongoUser?.bookmarkedBeneficiaries?.filter(
        (bookmark) => bookmark !== beneficiary._id,
      );
    } else {
      // We need to add bookmark
      newBookmarks = mongoUser?.bookmarkedBeneficiaries?.concat(
        beneficiary._id ?? "",
      );
    }
    try {
      await fetch(`https://vacnet-backend-deploy.vercel.app/user/edit?_id=${mongoUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookmarkedBeneficiaries: newBookmarks,
        }),
      }).then((res) => res.json() as unknown as Staff);
      setRefresh(!refresh);
    } catch {
      console.log("error bookmarking beneficiary");
    }
  };

  return (
    <Card
      className="cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
      onClick={() => navigate(`./${beneficiary._id}`)}
    >
      <CardHeader className="grid grid-cols-[1fr_32px] items-start gap-4 space-y-0">
        <div className="mb-1">
          <CardTitle className="mb-1">
            {beneficiary?.firstName} {beneficiary?.lastName}
          </CardTitle>
          <CardDescription className="flex flex-col">
            <span>({beneficiary?._id})</span>
          </CardDescription>
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
              <DropdownMenuCheckboxItem
                checked={mongoUser?.bookmarkedBeneficiaries?.includes(
                  beneficiary._id ?? "",
                )}
                onClick={(e) => handleBookmarkBeneficiary(e)}
              >
                Bookmark User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={(e) => handleGoToBeneficaryEdit(e)}
              >
                Edit Beneficiary
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                View User's Loans
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                View User's Sessions
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => handleGoToBeneficiary(e)}>
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
                : getLoanStatus() === "Pending"
                ? "warning"
                : "default"
            }
          >
            <BellIcon className="mr-1 h-3 w-3" />
            {getLoanStatus()}
          </Badge>
          <div className="flex items-center">
            <Icons.dolla className="mr-1 h-3 w-3" />
            20k
          </div>
          {beneficiary?.phoneNumber?.length ?? 0 > 0 ? (
            <div className="truncate">#: {beneficiary?.phoneNumber} </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryCard;
