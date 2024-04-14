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

import { Button } from "@/components/ui/button";
import type { IStaff } from "@/pages/staff/staff-members";
import { Icons } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";

const StaffCard = ({ staff }: { staff: IStaff }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
      onClick={() => navigate(`./${staff._id}`)}
    >
      <CardHeader className="grid grid-cols-[1fr_32px] items-start gap-4 space-y-0">
        <div>
          <CardTitle className="mb-1">
            {staff?.firstName} {staff?.lastName}
          </CardTitle>
          <CardDescription className="flex flex-col">
            <span>({staff?.firebaseUID})</span>
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
              <DropdownMenuCheckboxItem checked>
                Bookmark User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Edit Staff Member
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                View User's Sessions
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Icons.search className="mr-2 h-4 w-4" /> View Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="-mt-3">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Icons.dolla className="mr-1 h-3 w-3" />
            Sessions: {staff?.sessions != null ? 1 : 0}
          </div>
        </div>
        <div className="truncate text-muted-foreground text-sm">
          {staff?.email}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
