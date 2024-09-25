import { cn } from "@/lib/utils";
import * as React from "react";

const DefaultCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
DefaultCard.displayName = "DefaultCard";

const DefaultCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-3", className)}
    {...props}
  />
));
DefaultCardHeader.displayName = "DefaultCardHeader";

const DefaultCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold", className)} {...props} />
));
DefaultCardTitle.displayName = "DefaultCardTitle";

const DefaultCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
DefaultCardDescription.displayName = "DefaultCardDescription";

const DefaultCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-3 pt-0 text-sm", className)} {...props} />
));
DefaultCardContent.displayName = "DefaultCardContent";

const DefaultCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-3 pt-0", className)}
    {...props}
  />
));
DefaultCardFooter.displayName = "DefaultCardFooter";

export {
  DefaultCard,
  DefaultCardHeader,
  DefaultCardFooter,
  DefaultCardTitle,
  DefaultCardDescription,
  DefaultCardContent,
};
