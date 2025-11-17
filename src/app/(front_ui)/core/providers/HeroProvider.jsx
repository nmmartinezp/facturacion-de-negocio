"use client";

import { HeroUIProvider } from "@heroui/react";

export function HeroProvider({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
