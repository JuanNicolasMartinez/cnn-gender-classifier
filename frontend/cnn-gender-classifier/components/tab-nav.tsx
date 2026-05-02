"use client";

import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/lib/types";

import { TopNavPill } from "@/components/top-nav-pill";

type TabNavProps = {
  items: NavigationItem[];
};

export function TabNav({ items }: TabNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return <TopNavPill key={item.href} item={item} isActive={isActive} />;
      })}
    </nav>
  );
}
