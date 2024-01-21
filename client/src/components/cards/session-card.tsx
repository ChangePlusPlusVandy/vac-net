import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@/pages/sessions/sessions";

const SessionCard = ({ session, onDelete }: { session: Session, onDelete: (sessionId: string) => void }) => {
    const navigate = useNavigate();
  
    const handleSessionActions = async (e: React.MouseEvent, action: string) => {
      e.stopPropagation();
  
      switch (action) {
        case "edit":
          navigate(`./${session._id}?f=1`);
          break;
        case "delete":
          if (window.confirm(`Are you sure you want to delete session ${session._id}?`)) {
            try {
              const response = await fetch(`http://localhost:3001/session/?id=${session._id}`, {
                method: 'DELETE',
              });
  
              if (!response.ok) {
                throw new Error('Failed to delete the session');
              }
              console.log(`Session ${session._id} deleted successfully`);
  
              onDelete(session._id); // Call the passed function after successful deletion
            } catch (error) {
              console.error('Error deleting session:', error);
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
          <CardTitle>{new Date(session.sessionDate).toLocaleDateString()}</CardTitle>
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
            <DropdownMenuItem onClick={(e) => handleSessionActions(e, "delete")}>
              <Icons.close className="mr-2 h-4 w-4" /> Delete Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          {/* Display session details like staff and attendance */}
          <div className="flex items-center">
            <Icons.user className="mr-1 h-3 w-3" />
            Staff: {session.staff.join(', ')}
          </div>
          <div className="flex items-center">
            <Icons.check className="mr-1 h-3 w-3" />
            Attendance: {session.actualAttendance.length}/{session.expectedAttendance.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;