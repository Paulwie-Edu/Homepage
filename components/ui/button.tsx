import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-white shadow-glow hover:bg-white/20 border border-white/20 px-6 py-3",
        ghost: "hover:bg-white/10"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant }), className)} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
