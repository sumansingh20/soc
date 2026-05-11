'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen, FiClock, FiEdit2, FiLogOut, FiMail, FiTarget, FiUser } from 'react-icons/fi';
import { userApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, setUser, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || '', bio: user?.bio || '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) router.push('/login');
  }, [router, token]);

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName, bio: user.bio || '' });
  }, [user]);

  if (!user) return null;

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const response = await userApi.updateProfile(form);
    setUser(response.data.user);
    setEditMode(false);
    setMessage('Profile updated.');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const stats = [
    { label: 'Courses Enrolled', value: '7', icon: FiBookOpen },
    { label: 'Quizzes', value: 'SOC', icon: FiAward },
    { label: 'Labs', value: '6+', icon: FiTarget },
    { label: 'Track', value: '7 days', icon: FiClock },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-soc-accent text-soc-dark">
                <FiUser size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">{user.fullName}</h1>
                <p className="mt-2 flex items-center gap-2 text-soc-accent/70"><FiMail /> {user.email}</p>
                <p className="mt-1 text-sm capitalize text-gray-400">Role: <span className="text-soc-accent">{user.role}</span></p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setEditMode((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-soc-accent/30 px-4 py-2 font-semibold text-soc-accent">
                <FiEdit2 /> Edit
              </button>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border border-soc-red/40 px-4 py-2 font-semibold text-soc-red">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>

        {message && <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-100">{message}</div>}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 text-center">
                <Icon className="mx-auto mb-3 text-soc-accent" size={24} />
                <p className="mb-1 text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-white">Profile</h2>
            {editMode ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="w-full rounded-2xl border border-soc-accent/20 bg-soc-dark/80 px-4 py-3 text-white outline-none focus:border-soc-accent" />
                <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="min-h-40 w-full rounded-2xl border border-soc-accent/20 bg-soc-dark/80 px-4 py-3 text-white outline-none focus:border-soc-accent" placeholder="Write your SOC learning focus" />
                <button className="rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">Save profile</button>
              </form>
            ) : (
              <p className="leading-relaxed text-gray-300">{user.bio || 'HackShield SOC student learning practical blue team investigation.'}</p>
            )}
          </div>

          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Quick links</h2>
            <div className="space-y-3">
              <Link href="/student-dashboard" className="block rounded-2xl border border-soc-accent/20 px-4 py-3 text-soc-accent">Student dashboard</Link>
              <Link href="/day-wise" className="block rounded-2xl border border-soc-accent/20 px-4 py-3 text-soc-accent">Day wise learning</Link>
              <Link href="/labs" className="block rounded-2xl border border-soc-accent/20 px-4 py-3 text-soc-accent">Labs</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
