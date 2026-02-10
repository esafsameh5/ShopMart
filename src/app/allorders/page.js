"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllOrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/orders?placed=1&method=online");
  }, [router]);

  return null;
}
