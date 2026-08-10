import { cn } from "@/lib/utils";

/**
 * CareerScopeLogo
 *
 * Renders the CareerScope SVG logo with three preset sizes.
 *
 * @param {Object} props
 * @param {"sm"|"md"|"lg"} [props.size="md"] - sm = 32px, md = 40px, lg = 48px
 * @param {string} [props.className] - extra Tailwind classes
 * @param {boolean} [props.showText=true] - whether to show the text
 */
export function CareerScopeLogo({ className, size = "md", showText = true, ...rest }: any) {
  const sizeClasses: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses: Record<string, string> = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...rest}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" />
          <line x1="16" y1="6" x2="16" y2="26" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-60" />
          <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-60" />
          <circle cx="16" cy="16" r="2" fill="currentColor" className="text-accent" />
          <circle cx="22" cy="10" r="1.5" fill="currentColor" className="text-accent opacity-80" />
          <circle cx="10" cy="22" r="1.5" fill="currentColor" className="text-accent opacity-80" />
          <circle cx="22" cy="22" r="1" fill="currentColor" className="text-accent opacity-60" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold text-foreground", textSizeClasses[size])}>
          Career<span className="text-primary">Scope</span>
        </span>
      )}
    </div>
  );
}