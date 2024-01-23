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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";
import React from "react";
import type { Session } from "@/pages/sessions/sessions";
import { useNavigate } from "react-router-dom";

const SessionCard = ({
  session,
  onDelete,
}: {
  session: Session;
  onDelete: (sessionId: string) => void;
}) => {
  const navigate = useNavigate();

  const compareDate = (date: Date) => {
    const now = new Date();
    // formattedDate is necessary
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

  const handleSessionActions = async (e: React.MouseEvent, action: string) => {
    e.stopPropagation();

    switch (action) {
      case "edit":
        navigate(`./${session._id}?f=1`);
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete session ${session._id}?`,
          )
        ) {
          try {
            const response = await fetch(
              `http://localhost:3001/session/?id=${session._id}`,
              {
                method: "DELETE",
              },
            );

            if (!response.ok) {
              throw new Error("Failed to delete the session");
            }
            console.log(`Session ${session._id} deleted successfully`);

            onDelete(session._id); // Call the passed function after successful deletion
          } catch (error) {
            console.error("Error deleting session:", error);
          }
        }
        break;
      default:
        console.log(`Unknown action: ${action} for session ${session._id}`);
    }
  };

  return (
    <Card
      className="cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
      onClick={() => navigate(`./${session._id}?f=1`)}
    >
      <CardHeader className="grid grid-cols-[1fr_32px] items-start gap-4 space-y-0">
        <div>
          <CardTitle>
            {new Date(session.sessionDate).toLocaleDateString()}
          </CardTitle>
          <CardDescription>Region: {session.region}</CardDescription>
        </div>
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
            <DropdownMenuLabel>Session Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => handleSessionActions(e, "edit")}>
              <Icons.edit className="mr-2 h-4 w-4" /> Edit Session
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => handleSessionActions(e, "delete")}
            >
              <Icons.close className="mr-2 h-4 w-4" /> Delete Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <Icons.check className="mr-1 h-3 w-3" />
            Attendance: {session.actualAttendance.length}/
            {session.expectedAttendance.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
