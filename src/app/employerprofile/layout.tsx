import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Profile",
  description:
    "View company information and open jobs published by this employer.",
  keywords: ["company profile", "employer", "jobs", "hiring"],
  openGraph: {
    title: "Company Profile",
    description:
      "View company information and open jobs published by this employer.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EmployerProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
