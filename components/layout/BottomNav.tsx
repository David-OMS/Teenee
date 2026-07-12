"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/constants/navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function isDarkRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/dump") ||
    pathname.startsWith("/practice") ||
    pathname.startsWith("/explain")
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const dark = isDarkRoute(pathname);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md ${
        dark
          ? "border-white/10 bg-canvas-dark/95"
          : "border-border-light bg-canvas-light/95"
      }`}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors ${
                  active ? "text-accent" : dark ? "text-muted-dark" : "text-muted-light"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${active ? "bg-accent" : "bg-transparent"}`}
                />
                {item.shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
