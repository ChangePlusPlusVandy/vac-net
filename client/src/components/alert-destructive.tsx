import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/ui/icons";

export function AlertDestructive({
  errorDescription,
}: {
  errorDescription: string | undefined;
}) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <Icons.logo className="mx-auto h-6 w-6" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorDescription ?? "Something went wrong."}
      </AlertDescription>
    </Alert>
  );
}
