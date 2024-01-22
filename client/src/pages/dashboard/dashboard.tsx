import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Dashboard = () => {
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
  const [delinquentLoans, setDelinquentLoans] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:3001/beneficiary/count")
      .then((res) => res.json())
      .then((data) => {
        setTotalBeneficiaries(data.totalBeneficiaries);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    fetch("http://localhost:3001/session/noshows?id=65a45fd23f430f539ae0e1c3")
      .then((res) => res.json())
      .then((data) => {
        setDelinquentLoans(data);
      })
  }, []);

  return (
    <>
    <Label className="text-4xl p-4">Dashboard</Label>
    <Card className="w-1/3 inline-block m-4">
      <CardHeader>
        <CardTitle className="text-center text-xl">Total Beneficiaries</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-xl">
        {totalBeneficiaries}
      </CardContent>
    </Card>

    <Card className="w-1/3 inline-block m-4">
      <CardHeader>
        <CardTitle className="text-center text-xl">Session No Shows</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-xl">
        <ul>
          {delinquentLoans.map((loan, index) => (
            <li key={index}>{loan}</li>
          ))}
        </ul>
      </CardContent>
    </Card>


    </>
  );
};

export default Dashboard;
