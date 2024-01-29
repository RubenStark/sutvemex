"use client";

import Navbar from "@/components/navbar";
import { ToastProvider } from "@/providers/toast-provider";
import { NextUIProvider } from "@nextui-org/react";
function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextUIProvider>
      <ToastProvider />
      <Navbar />
      {children}
    </NextUIProvider>
  );
}

export default Layout;
