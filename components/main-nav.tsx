"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: 'Overview',
      active: pathname === `/`,
    },
    {
      href: `/products`,
      label: 'Productos',
      active: pathname === `/products`,
    },
    {
      href: `/cotizaciones`,
      label: 'Cotizaciones',
      active: pathname === `/cotizaciones`,
    },
    {
      href: `/ordenes`,
      label: 'Ordenes',
      active: pathname === `/ordenes`,
    },
    {
      href: `/clientes`,
      label: 'Clientes',
      active: pathname === `/clientes`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
