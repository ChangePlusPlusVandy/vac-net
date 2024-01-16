import type { IStaff } from "@/pages/staff/staff-members"
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const StaffCard = ({staff} : {staff: IStaff}) => {
    const navigate = useNavigate();
    

    return (
        <Card
            className="cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
        >
            <CardHeader className="grid grid-cols-[1fr_32px] items-start gap-4 space-y-0">
            <div className="mb-1">
                <CardTitle className="mb-1">
                    {staff?.firstName} {staff?.lastName}
                </CardTitle>
                <CardDescription className="flex flex-col">
                    <span>({staff?.firebaseUID})</span>
                </CardDescription>
            </div>
            </CardHeader>
        </Card>
    )
}

export default StaffCard