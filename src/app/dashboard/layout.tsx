import type { Metadata } from "next";
import { DashboardChrome } from "@/components/dashboard/chrome";

export const metadata: Metadata = {
  title: {
    default: "Command Center",
    template: "%s — 3Wives AI",
  },
  description:
    "Relationship infrastructure command center: stability, coverage, emotional debt, collisions, gifts and incidents across three isolated contexts.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardChrome>{children}</DashboardChrome>;
}
