"use client";

import NotFoundPage from "@/components/pages/NotFoundPage/NotFoundPage";

export default function NotFound() {
  return <NotFoundPage onGoHome={() => window.location.href = "/"} />;
}