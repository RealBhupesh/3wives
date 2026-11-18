"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#product", label: "Platform" },
  { href: "/engine", label: "Inference Engine" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-line bg-ground/85 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = link.href === "/pricing" ? pathname === "/pricing" : link.href === "/engine" ? pathname === "/engine" : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-[13px] transition-colors",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">Command Center</Link>
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href="/pricing">
              Initialize your empire
              <ArrowUpRight />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="accent" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-ground">
              <SheetTitle>Navigation</SheetTitle>
              <div className="mt-10 flex flex-col gap-1">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-md px-3 py-3 text-[15px] text-muted transition-colors hover:bg-white/5 hover:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-[15px] text-muted transition-colors hover:bg-white/5 hover:text-ink"
                >
                  Command Center
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="mt-auto border-t border-line pt-4">
                <Button asChild variant="accent" className="w-full">
                  <Link href="/pricing" onClick={() => setOpen(false)}>
                    Initialize your empire
                  </Link>
                </Button>
                <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  3 relationships · 1 identity
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
