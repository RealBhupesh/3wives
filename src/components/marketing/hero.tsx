"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelationshipMesh, MeshLegend } from "./relationship-mesh";

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36" id="top">
      <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
      <div aria-hidden className="glow-top" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />
      <div className="container-page relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
          <motion.div
            initial={reduce ? false : "hidden"}
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
          >
            <motion.div variants={fade} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/[0.05] px-3 py-1">
                <span className="status-dot text-green" />
                <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-green">
                  All 3 relationships operational
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="display mt-7 text-[clamp(50px,8.4vw,86px)]"
            >
              <span className="block">Three wives.</span>
              <span className="block">One you.</span>
              <span className="block">
                Zero <span className="text-gradient">collisions.</span>
              </span>
            </motion.h1>

            <motion.p
              variants={fade}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-[500px] text-[16px] leading-[1.65] text-muted md:text-[17px]"
            >
              The world&apos;s first multi-relationship inference engine. One AI that remembers everything, says the right
              things, and keeps every version of your life running perfectly.
            </motion.p>

            <motion.div
              variants={fade}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild variant="accent" size="lg" className="group">
                <Link href="/pricing">
                  Initialize your empire
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#product">
                  <Play className="fill-current" />
                  See how it works
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fade}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.11em] text-faint"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-green/80" />
                99.9% context isolation
              </span>
              <span>3 namespaces provisioned in 40s</span>
              <span>No card required</span>
            </motion.div>
          </motion.div>

          <div className="relative">
            <RelationshipMesh />
            <MeshLegend />
          </div>
        </div>
      </div>
    </section>
  );
}
