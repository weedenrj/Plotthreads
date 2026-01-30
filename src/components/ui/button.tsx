import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-shadow-grey-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brandy-500 text-ivory-50 hover:bg-brandy-400 hover:shadow-lg hover:shadow-brandy-500/25",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-shadow-grey-700 bg-shadow-grey-900 text-ivory-100 hover:border-shadow-grey-600 hover:bg-shadow-grey-800",
        secondary:
          "bg-shadow-grey-800 text-ivory-100 hover:bg-shadow-grey-700",
        ghost: "text-ivory-100 hover:bg-shadow-grey-800",
        link: "text-brandy-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 px-8 py-3.5 text-base font-semibold",
        xl: "h-14 px-10 py-4 text-lg font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
