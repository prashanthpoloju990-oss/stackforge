import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface BlobButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "popular" | "normal";
}

export const BlobButton = React.forwardRef<HTMLButtonElement, BlobButtonProps>(
  ({ className, asChild, variant = "normal", children, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    const isPopular = variant === "popular";

    return (
      <>
        {/* Hidden SVG Filter Definition */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" style={{ display: "none" }}>
          <defs>
            <filter id="pricing-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        <Component
          ref={ref}
          className={cn(
            "blob-btn-container relative overflow-hidden group select-none transition-all duration-300",
            className
          )}
          {...props}
        >
          <Slottable>{children}</Slottable>

          {/* Liquid blobs container with gooey filter */}
          <span
            className="absolute inset-0 z-[-1] flex pointer-events-none bg-transparent"
            style={{ filter: "url(#pricing-goo)" }}
          >
            <span
              className={cn(
                "blob-fill absolute top-0 w-[30%] h-[120%] rounded-[100%] translate-y-[120%] transition-transform duration-500 ease-out group-hover:translate-y-0 scale-[1.7]",
                isPopular ? "bg-[#e55f00]" : "bg-forge-surface"
              )}
              style={{ left: "-5%", transitionDelay: "0s" }}
            />
            <span
              className={cn(
                "blob-fill absolute top-0 w-[30%] h-[120%] rounded-[100%] translate-y-[120%] transition-transform duration-500 ease-out group-hover:translate-y-0 scale-[1.7]",
                isPopular ? "bg-[#e55f00]" : "bg-forge-surface"
              )}
              style={{ left: "20%", transitionDelay: "0.04s" }}
            />
            <span
              className={cn(
                "blob-fill absolute top-0 w-[30%] h-[120%] rounded-[100%] translate-y-[120%] transition-transform duration-500 ease-out group-hover:translate-y-0 scale-[1.7]",
                isPopular ? "bg-[#e55f00]" : "bg-forge-surface"
              )}
              style={{ left: "45%", transitionDelay: "0.08s" }}
            />
            <span
              className={cn(
                "blob-fill absolute top-0 w-[30%] h-[120%] rounded-[100%] translate-y-[120%] transition-transform duration-500 ease-out group-hover:translate-y-0 scale-[1.7]",
                isPopular ? "bg-[#e55f00]" : "bg-forge-surface"
              )}
              style={{ left: "70%", transitionDelay: "0.12s" }}
            />
            <span
              className={cn(
                "blob-fill absolute top-0 w-[30%] h-[120%] rounded-[100%] translate-y-[120%] transition-transform duration-500 ease-out group-hover:translate-y-0 scale-[1.7]",
                isPopular ? "bg-[#e55f00]" : "bg-forge-surface"
              )}
              style={{ left: "95%", transitionDelay: "0.16s" }}
            />
          </span>
        </Component>
      </>
    );
  }
);

BlobButton.displayName = "BlobButton";
