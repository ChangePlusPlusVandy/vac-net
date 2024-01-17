//imports here
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import type { Loan } from "@/pages/loans/loans";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { type Staff } from "@/contexts/AuthContext";

const LoanCard = ({ loan }: { loan: Loan }) => {

};
export default LoanCard;