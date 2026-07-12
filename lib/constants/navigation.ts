export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Profile", shortLabel: "Profile" },
  { href: "/dump", label: "Dump", shortLabel: "Dump" },
  { href: "/practice", label: "Practice", shortLabel: "Practice" },
  { href: "/progress", label: "Progress", shortLabel: "Progress" },
  { href: "/settings", label: "Settings", shortLabel: "Settings" },
];
