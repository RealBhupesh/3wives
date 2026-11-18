"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AnnouncementBar } from "./announcement-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/engine", label: "Engine" },
  { href: "/#customers", label: "Customers" },
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
        "fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled && "-translate-y-9",
      )}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "transition-colors duration-300",
          scrolled ? "border-b border-line bg-white/80 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
      <div className="container-page grid h-16 grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center">
          <Logo />
        </div>
        <nav aria-label="Primary" className="hidden items-center gap-0.5 rounded-full border border-line bg-white/70 p-1 md:flex">
            {LINKS.map((link) => {
              const active = link.href === "/pricing" ? pathname === "/pricing" : link.href === "/engine" ? pathname === "/engine" : false;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors",
                    active ? "bg-ink text-white" : "text-muted hover:bg-ink/[0.05] hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

        <div className="hidden items-center justify-end gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-[13.5px]">
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="h-9 rounded-full px-4 text-[13.5px]">
            <Link href="/pricing">
              Get 3Wives
              <ArrowUpRight />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" className="rounded-full">
            <Link href="/dashboard">Demo</Link>
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
                    className="flex items-center justify-between rounded-md px-3 py-3 text-[15px] text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-[15px] text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  Command Center
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="mt-auto border-t border-line pt-4">
                <Button asChild variant="accent" className="w-full">
                  <Link href="/pricing" onClick={() => setOpen(false)}>
                    Get 3Wives
                  </Link>
                </Button>
                <p className="mt-3 text-center text-[11.5px] text-faint">
                  3 relationships · 1 identity
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      </div>
    </header>
  );
}
