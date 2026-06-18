import { BlobButton } from "@/components/ui/blob-button";
import { Check, Layers, Rocket, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  popular?: boolean;
  colorClass: string;
}

const iconColorMap: Record<string, string> = {
  warm: "text-forge-accent/70",
  accent: "text-forge-accent",
  muted: "text-forge-text-secondary",
};

function CreativePricing({
  tiers,
}: {
  tiers: PricingTier[];
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group",
              "transition-all duration-300",
              index === 0 && "rotate-[-1deg]",
              index === 1 && "rotate-[1deg] md:scale-[1.03]",
              index === 2 && "rotate-[-2deg]"
            )}
          >
            {/* Card body with neobrutalist shadow */}
            <div
              className={cn(
                "absolute inset-0 bg-forge-surface",
                "border-2 border-forge-text",
                "rounded-lg shadow-[4px_4px_0px_0px_var(--forge-accent)]",
                "transition-all duration-300",
                "group-hover:shadow-[8px_8px_0px_0px_var(--forge-accent)]",
                "group-hover:translate-x-[-4px]",
                "group-hover:translate-y-[-4px]",
                tier.popular && "shadow-[4px_4px_0px_0px_var(--forge-accent)]"
              )}
            />

            <div className="relative p-6">
              {/* Popular badge */}
              {tier.popular && (
                <div
                  className="absolute -top-2.5 -right-2.5 bg-forge-accent text-white
                  font-syne font-bold px-3 py-1 rounded-full rotate-12 text-xs uppercase tracking-wider border-2 border-forge-text"
                >
                  Most Picked
                </div>
              )}

              {/* Icon + Name */}
              <div className="mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full mb-4",
                    "flex items-center justify-center",
                    "border-2 border-forge-text",
                    tier.colorClass
                  )}
                >
                  {tier.icon}
                </div>
                <h3 className="text-fluid-h4 font-bold text-forge-text font-syne">
                  {tier.name}
                </h3>
                <p className="text-fluid-body text-forge-text-secondary mt-1">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-fluid-hero font-bold text-forge-text font-syne">
                  {tier.price}
                </span>
                <span className="text-fluid-label text-forge-text-secondary ml-1">
                  {tier.priceNote}
                </span>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-forge-text
                      flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-fluid-body text-forge-text">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <BlobButton
                asChild
                variant={tier.popular ? "popular" : "normal"}
                className={cn(
                  "w-full h-fluid-btn font-syne font-bold text-fluid-btn uppercase tracking-wider relative",
                  "border-2 border-forge-text",
                  "transition-all duration-300",
                  "shadow-[4px_4px_0px_0px] shadow-forge-accent",
                  "hover:shadow-[6px_6px_0px_0px] hover:shadow-forge-accent",
                  "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                  "active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px]",
                  tier.popular
                    ? [
                        "bg-forge-accent text-white",
                      ]
                    : [
                        "bg-forge-bg text-forge-text",
                      ]
                )}
              >
                <a href="/start-project">
                  {tier.popular ? "Start Building" : "Get Started"}
                </a>
              </BlobButton>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 text-2xl text-forge-accent/20 rotate-12">
          <Rocket className="w-8 h-8" />
        </div>
        <div className="absolute bottom-40 right-10 text-2xl text-forge-accent/20 -rotate-12">
          <Zap className="w-8 h-8" />
        </div>
        <div className="absolute top-1/2 left-1/3 text-2xl text-forge-accent/10 rotate-6">
          <Layers className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export { CreativePricing };
export type { PricingTier };
