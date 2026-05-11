'use client';

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-soc-darker border-t border-soc-accent/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold neon-text mb-4">SOC Academy</h3>
            <p className="text-gray-400 text-sm">
              Advanced Security Operations Center training platform for cybersecurity professionals.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h4 className="text-sm font-semibold text-soc-accent mb-4">Learning</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/courses" className="hover:text-soc-accent transition">Courses</Link></li>
              <li><Link href="/labs" className="hover:text-soc-accent transition">Labs</Link></li>
              <li><Link href="/challenges" className="hover:text-soc-accent transition">Challenges</Link></li>
              <li><Link href="/resources" className="hover:text-soc-accent transition">Resources</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-soc-accent mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/forum" className="hover:text-soc-accent transition">Forum</Link></li>
              <li><Link href="/blog" className="hover:text-soc-accent transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-soc-accent transition">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-soc-accent mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy" className="hover:text-soc-accent transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-soc-accent transition">Terms</Link></li>
              <li><Link href="/contact" className="hover:text-soc-accent transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-soc-accent/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; {currentYear} SOC Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-soc-accent transition">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-soc-accent transition">Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-soc-accent transition">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
