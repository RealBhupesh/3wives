"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck2, HeartPulse, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanesBoard } from "./lanes-board";
import { FloatCard, Portrait } from "./art";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } };
  const pop = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.92, y: 12 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section className="relative overflow-hidden pt-32 md:pt-40" id="top">
      <div aria-hidden className="aurora absolute inset-x-0 top-0 h-[900px]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[900px] grid-bg opacity-60" />

      <div className="container-page relative">
        <div className="mx-auto flex max-w-[920px] flex-col items-center text-center">
          <motion.div {...rise(0)}>
            <Link
              href="/engine"
              className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-white/80 py-1 pl-1 pr-3.5 text-[13px] text-muted shadow-[0_1px_2px_rgba(9,9,11,0.05)] backdrop-blur transition-colors hover:text-ink"
            >
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11.5px] font-semibold text-white">New</span>
              <span className="sm:hidden">Memory 2.0 is here</span>
              <span className="hidden sm:inline">Memory 2.0 remembers every promise you make</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1 {...rise(0.08)} className="display mt-8 text-[clamp(46px,7.6vw,104px)]">
            Be fully present in every relationship.
          </motion.h1>

          <motion.p {...rise(0.18)} className="mt-7 max-w-[600px] text-[18px] leading-[1.6] text-muted md:text-[19px]">
            3Wives remembers what matters to each person, helps you reply with care, and keeps every relationship
            completely private from the others.
          </motion.p>

          <motion.div {...rise(0.26)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 rounded-full px-7 text-[15px]">
              <Link href="/pricing">
                Start free
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full bg-white px-7 text-[15px]">
              <Link href="/dashboard">Explore the live demo</Link>
            </Button>
          </motion.div>

          <motion.div {...rise(0.34)} className="mt-9 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {(["m1", "m2", "m3", "m4", "m5"] as const).map((k) => (
                <Portrait key={k} spec={k} size={34} className="ring-[2.5px] ring-white" />
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-0.5 text-[#f5a524]" aria-label="Rated 4.9 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-0.5 text-[13px] text-muted">
                <span className="font-semibold text-ink">41,000+</span> members stay present
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1120px] md:mt-20">
          <motion.div
            className="stage stage-olivia p-3 sm:p-5 md:p-7"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.45, ease }}
          >
            <LanesBoard />
          </motion.div>

          {/* Floating context cards */}
          <motion.div {...pop(0.9)} className="absolute -left-10 top-24 z-20 hidden w-[250px] xl:block">
            <FloatCard className="animate-drift">
              <div className="flex items-center gap-3">
                <Portrait spec="sophia" size={40} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">Anniversary armed</p>
                  <p className="text-[12px] text-muted">Sophia · Fri, Lucca 8:00 PM</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#fff3ea] px-2.5 py-2 text-[12px] text-[#b4500f]">
                <CalendarCheck2 className="size-4" />
                Table booked, flowers queued
              </div>
            </FloatCard>
          </motion.div>

          <motion.div {...pop(1.05)} className="absolute -right-12 top-10 z-20 hidden w-[240px] xl:block">
            <FloatCard className="animate-drift-slow">
              <div className="flex items-center gap-2">
                <span className="icon-tile size-8 bg-gradient-to-br from-[#8f7bff] to-[#5b4cf5]">
                  <ShieldCheck className="size-4" />
                </span>
                <p className="text-[13px] font-semibold">Collision prevented</p>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                Olivia&apos;s dinner moved to Sat 7:30 PM with a reason she&apos;ll love.
              </p>
            </FloatCard>
          </motion.div>

          <motion.div {...pop(1.2)} className="absolute -right-8 bottom-16 z-20 hidden w-[230px] xl:block">
            <FloatCard className="animate-drift">
              <div className="flex items-center gap-3">
                <Portrait spec="isabella" size={36} />
                <div>
                  <p className="text-[13px] font-semibold">Isabella</p>
                  <p className="flex items-center gap-1 text-[12px] text-[#0b7a6b]">
                    <HeartPulse className="size-3.5" /> Mood up 12% this week
                  </p>
                </div>
              </div>
              <svg viewBox="0 0 200 40" className="mt-2 h-9 w-full" aria-hidden>
                <defs>
                  <linearGradient id="hero-spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0f9d8a" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0f9d8a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 32 C20 30 30 34 50 26 S80 28 100 20 S140 22 160 12 S190 8 200 6 V40 H0Z" fill="url(#hero-spark)" />
                <path d="M0 32 C20 30 30 34 50 26 S80 28 100 20 S140 22 160 12 S190 8 200 6" fill="none" stroke="#0f9d8a" strokeWidth="2.2" />
              </svg>
            </FloatCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
