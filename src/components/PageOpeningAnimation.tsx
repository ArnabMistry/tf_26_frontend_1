"use client";

import { usePathname } from "next/navigation";
import { StarLoader } from "@/components/StarLoader";

export function PageOpeningAnimation() {
  const pathname = usePathname();
  return <StarLoader key={pathname} />;
}
