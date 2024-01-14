import * as React from "react";

import { type ButtonProps, buttonVariants } from "@/components/ui/button";

import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type ItemCreateButtonProps = ButtonProps & {
  isLoading?: boolean;
  item: string;
  onClick?: () => void;
};

export function ItemCreateButton({
  className,
  onClick,
  variant,
  isLoading,
  item,
  ...props
}: ItemCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className,
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      {item}
    </button>
  );
}
