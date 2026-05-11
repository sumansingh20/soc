'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSearch, FiShield, FiBookOpen } from 'react-icons/fi';
import { socSidebarLinks } from '@/lib/soc-content';

export const SocSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex fixed left-0 top-20 bottom-0 w-72 flex-col border-r border-soc-accent/15 bg-soc-darker/90 backdrop-blur-xl z-40">
      <div className="p-5 border-b border-soc-accent/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-xl bg-soc-accent/15 border border-soc-accent/30 flex items-center justify-center text-soc-accent">
            <FiShield size={20} />
          </div>
          <div>
            <p className="text-white font-semibold">HackShield SOC</p>
            <p className="text-xs text-soc-accent/60">Practical blue team training</p>
          </div>
        </div>

        <Link
          href="/search"
          className="flex items-center gap-3 rounded-xl bg-soc-dark/70 border border-soc-accent/15 px-4 py-3 text-soc-accent/70 hover:border-soc-accent/40 hover:text-soc-accent transition"
        >
          <FiSearch />
          Search lessons, labs, and commands
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {socSidebarLinks.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm transition border ${
                active
                  ? 'bg-soc-accent/15 border-soc-accent/40 text-soc-accent shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                  : 'bg-transparent border-transparent text-soc-accent/65 hover:border-soc-accent/20 hover:bg-soc-accent/5 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{link.label}</span>
                {active && <span className="text-xs uppercase tracking-[0.2em] text-soc-accent/70">Now</span>}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-5 border-t border-soc-accent/10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-soc-accent/15 bg-soc-dark/60 p-4"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-soc-accent/50 mb-2">Focus</p>
          <p className="text-sm text-white leading-relaxed">
            SOC basics, log analysis, Linux investigation, SIEM thinking, and real analyst workflow.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-soc-accent/70">
            <FiBookOpen />
            Created by Suman Kumar
          </div>
        </motion.div>
      </div>
    </aside>
  );
};
