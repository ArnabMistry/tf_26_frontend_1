"use client";

import { usePathname } from "next/navigation";
import { StarLoader } from "@/components/StarLoader";

export function PageOpeningAnimation() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <StarLoader key={pathname} />;
}
