'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { FiMenu, FiX, FiLogOut, FiSearch, FiBookOpen } from 'react-icons/fi';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, setUser, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const hydrateUser = async () => {
      if (!token || user) return;
      try {
        const response = await authApi.getMe();
        setUser(response.data.user);
      } catch {
        logout();
      }
    };

    hydrateUser();
  }, [logout, setUser, token, user]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About SOC' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/labs', label: 'Labs' },
    { href: '/resources', label: 'Resources' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-soc-darker/80 backdrop-blur-lg border-b border-soc-accent/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold neon-text"
          >
            SOC
          </motion.div>
          <span className="text-sm text-gray-400">Training Portal</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? 'text-soc-accent'
                  : 'text-gray-400 hover:text-soc-accent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Menu / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            className="p-2 text-gray-400 hover:text-soc-accent transition-colors"
            aria-label="Search the platform"
          >
            <FiSearch size={18} />
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-lg bg-soc-accent/10 text-soc-accent border border-soc-accent/30 hover:bg-soc-accent/20 transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/student-dashboard"
                className="px-4 py-2 rounded-lg bg-soc-accent/10 text-soc-accent border border-soc-accent/30 hover:bg-soc-accent/20 transition-colors"
              >
                Student Dashboard
              </Link>
              <button
                onClick={() => logout()}
                aria-label="Log out"
                title="Log out"
                className="p-2 text-gray-400 hover:text-soc-accent transition-colors"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-soc-accent hover:text-soc-accent/80 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-soc-accent text-soc-darker font-semibold hover:bg-soc-accent/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-soc-accent transition-colors"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-soc-dark/95 border-b border-soc-accent/20 py-4"
        >
          <div className="container mx-auto px-4 flex flex-col gap-4">
            <Link
              href="/search"
              className="flex items-center gap-2 text-sm text-soc-accent"
              onClick={() => setIsOpen(false)}
            >
              <FiSearch size={16} /> Search
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-soc-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link href="/login" className="text-sm text-soc-accent">
                  Login
                </Link>
                <Link href="/register" className="text-sm text-soc-accent">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};
