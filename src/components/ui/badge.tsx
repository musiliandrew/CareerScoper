// @ts-nocheck
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/lib/variants";

function Badge({ className, variant = "default", asChild = false, ...props }: any) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };