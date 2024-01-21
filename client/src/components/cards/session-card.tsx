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
import type { Session } from "@/pages/sessions/sessions";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { type Staff } from "@/contexts/AuthContext";

const SessionCard = ({ session }: { session: Session }) => {
  const navigate = useNavigate();
  const { mongoUser, refresh, setRefresh } = useAuth();

  // const getLoanStatus = () => {
  //   if (!beneficiary.loan) return "No Loan";

  //   return beneficiary.loan?.loanStatus;
  // };

  const formatDate = (date: Date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString([], options);
  };

  const compareDate = (date: Date) => {
    const now = new Date();
    const formattedDate = new Date(date);

    //This is a check for same day, because now.getTime() does not equal formattedDate.getTime()
    if (
      now.getFullYear() === formattedDate.getFullYear() &&
      now.getMonth() === formattedDate.getMonth() &&
      now.getDay() === formattedDate.getDay()
    )
      return "Today";
    if (Date.now() < formattedDate.getTime()) return "Upcoming";
    return "Complete";
  };

  const handleGoToSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`./${session._id}`);
  };

  const handleGoToSessionEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`./${session._id}?f=1`);
  };

  // const handleBookmarkBeneficiary = async (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   console.log("bookmarking beneficiary");
  //   let newBookmarks;
  //   if (mongoUser?.bookmarkedBeneficiaries?.includes(beneficiary._id ?? "")) {
  //     // We need to remove bookmark
  //     newBookmarks = mongoUser?.bookmarkedBeneficiaries?.filter(
  //       (bookmark) => bookmark !== beneficiary._id,
  //     );
  //   } else {
  //     // We need to add bookmark
  //     newBookmarks = mongoUser?.bookmarkedBeneficiaries?.concat(
  //       beneficiary._id ?? "",
  //     );
  //   }
  //   try {
  //     await fetch(`http://localhost:3001/user/edit?_id=${mongoUser?._id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         bookmarkedBeneficiaries: newBookmarks,
  //       }),
  //     }).then((res) => res.json() as unknown as Staff);
  //     setRefresh(!refresh);
  //   } catch {
  //     console.log("error bookmarking beneficiary");
  //   }
  // };

  return (
    <Card
      className="cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
      onClick={() => navigate(`./${session._id}`)}
    >
      <CardHeader className="grid grid-cols-[1fr_32px] items-start gap-4 space-y-0">
        <div className="mb-1">
          <CardTitle className="mb-1">
            {formatDate(session?.sessionDate)}
          </CardTitle>
          <CardDescription className="flex flex-col">
            <span>({session?.region})</span>
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
              {/* <DropdownMenuCheckboxItem
                checked={mongoUser?.bookmarkedBeneficiaries?.includes(
                  beneficiary._id ?? "",
                )}
                onClick={(e) => handleBookmarkBeneficiary(e)}
              >
                Bookmark User
              </DropdownMenuCheckboxItem> */}
              <DropdownMenuCheckboxItem
                onClick={(e) => handleGoToSessionEdit(e)}
              >
                Edit Session
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem> View Session</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => handleGoToSession(e)}>
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
              compareDate(session?.sessionDate) === "Upcoming"
                ? "default"
                : compareDate(session?.sessionDate) === "Today"
                ? "destructive"
                : "secondary"
            }
          >
            <BellIcon className="mr-1 h-3 w-3" />
            {compareDate(session?.sessionDate)}
          </Badge>
          <div className="flex items-center">
            Expected: {session?.expectedAttendance.length}
          </div>
          {/* {beneficiary?.phoneNumber?.length ?? 0 > 0 ? (
            <div className="truncate">#: {beneficiary?.phoneNumber} </div>
          ) : null} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
