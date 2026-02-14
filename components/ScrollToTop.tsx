"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return null;
}
