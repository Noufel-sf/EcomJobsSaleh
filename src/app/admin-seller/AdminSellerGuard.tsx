"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminSellerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
