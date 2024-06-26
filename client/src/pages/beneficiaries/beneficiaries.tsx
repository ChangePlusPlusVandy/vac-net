import React, { useEffect, useState } from "react";

import { AddBeneficiary } from "./add-beneficiary";
import BeneficiaryCard from "@/components/cards/beneficiary-card";
import BeneficiaryToolbar from "@/components/toolbars/beneficiary-toolbar";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import type { Loan } from "../loans/loans";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { type Session } from "../sessions/sessions";

export interface Beneficiary {
  _id?: string;
  firstName?: string;
  lastName?: string;
  joinDate?: Date;
  languages?: string[];
  phoneNumber?: string;
  archived?: boolean;
  birthday?: Date;
  currentSavings?: number;
  currentSpending?: number;
  priorities?: string[];
  loan?: Loan;
  children?: number;
  associatedLoans?: Loan[];
  associatedSessions?: Session[];
  age?: number;
  villageOrCity?: string;
  maritalStatus?: string;
  peopleInHousehold?: number;
  numFinancialDependents?: number;
  currentWeeklyIncomeInUGX?: number;
  currentlyWeeklyIncomeInUSD?: number;
  currentSpendingInUGX?: number;
  currentSavingsInUGX?: number;
  currentSavingsInUSD?: number;
  locationOfSavings?: string;
  businessDescription?: string;
  ownYourLand?: boolean;
  ownYourHouse?: string;
  highestEducationLevel?: string;
  howManyRoomsInHouse?: number;
  roofMaterial?: string;
  wallMaterial?: string;
  floorMaterial?: string;
  lightSource?: string;
  ownLivestock?: string;
  cows?: number;
  goats?: number;
  chickens?: number;
  turkeys?: number;
  otherLivestock?: string;
  bio?: string;
  howManyMealsPerDay?: number;
  howManyMealsPerWeeksWithChicken?: number;
  howManyMealsPerWeekWithMeat?: number;
  howManyMealsPerWeekWithFish?: number;
  childrenWithShoes?: number;
  numberInHoseholdNeedMeds?: number;
  contractedMalria?: boolean;
  howManyEmployees?: number;
  howDoesHusbandHelp?: string;
  electricityAccessInBusiness?: boolean;
}

const Beneficiaries = () => {
  const [query, setQuery] = useSearchParams();
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [notifyNew, setNotifyNew] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const { mongoUser } = useAuth();

  useEffect(() => {
    if (!sort) return;

    switch (sort) {
      case "1":
        console.log("sort by first name");
        const firstNameSort = [...beneficiaries];
        firstNameSort.sort((a, b) => {
          if (a.firstName && b.firstName) {
            return a.firstName.localeCompare(b.firstName);
          }
          return 0;
        });
        console.log(firstNameSort);
        setBeneficiaries(firstNameSort);
        break;
      case "2":
        const lastNameSort = [...beneficiaries];
        lastNameSort.sort((a, b) => {
          if (a.lastName && b.lastName) {
            return a.lastName.localeCompare(b.lastName);
          }
          return 0;
        });
        setBeneficiaries(lastNameSort);
        break;
      case "3":
        const joinDateSort = [...beneficiaries];
        joinDateSort.sort((a, b) => {
          if (a.joinDate && b.joinDate) {
            return (
              new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
            );
          }
          return 0;
        });
        setBeneficiaries(joinDateSort);
        break;
      case "4":
      // TODO
    }
  }, [sort]);

  useEffect(() => {
    const getBeneficiaries = async () => {
      try {
        const data: Beneficiary[] = await fetch(
          "https://vac-net-backend.vercel.app/beneficiary/all",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res: Response) => res.json() as unknown as Beneficiary[]);
        console.log(data);
        // TODO: decide what the initial sort should be
        setBeneficiaries(data);
      } catch (error) {
        console.error(error);
      }
    };
    void getBeneficiaries();
  }, [notifyNew]);

  const handleFilters = (b: Beneficiary) => {
    if (!status) return true;

    switch (status) {
      case "0":
        return mongoUser?.bookmarkedBeneficiaries?.includes(b._id ?? "");
      case "1":
        return b.loan === undefined;
      case "2":
        return b.loan?.loanStatus === "Pending Approval";
      case "3":
        return b.loan?.loanStatus === "Good Standing";
      case "4":
        return b.loan?.loanStatus === "Delinquient";
      case "5":
        return b.loan?.loanStatus === "Fully Paid Off";
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Beneficaries"
        text="View and manage your beneficary data."
      >
        <AddBeneficiary setNotify={setNotifyNew} notify={notifyNew} />
      </DashboardHeader>
      <BeneficiaryToolbar
        query={query.get("f")}
        setQuery={setQuery}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />
      <div className="py-3 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {beneficiaries
          .filter((bene) => {
            if (!query.get("f")) return true;
            return (
              bene.firstName
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              bene.lastName
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "") ??
              bene._id
                ?.toLowerCase()
                .includes(query.get("f")?.toLowerCase() ?? "")
            );
          })
          .filter((bene) => handleFilters(bene))
          .map((bene, i) => {
            return <BeneficiaryCard beneficiary={bene} key={i} />;
          })}
      </div>
    </DashboardShell>
  );
};

export default Beneficiaries;
