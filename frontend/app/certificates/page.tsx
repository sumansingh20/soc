'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiCheckCircle, FiDownload, FiShare2, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function CertificatesPage() {
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'expired'>('all');
  const [searchCode, setSearchCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; data?: any } | null>(null);

  const certificates = [
    {
      id: 1,
      courseName: 'Linux Fundamentals',
      certificateCode: 'SOC-LF-2026-001',
      issuedDate: 'May 8, 2026',
      expiryDate: 'May 8, 2027',
      status: 'active',
      score: 92,
    },
    {
      id: 2,
      courseName: 'Networking Fundamentals',
      certificateCode: 'SOC-NF-2025-001',
      issuedDate: 'March 15, 2025',
      expiryDate: 'March 15, 2026',
      status: 'expired',
      score: 88,
    },
    {
      id: 3,
      courseName: 'SOC Fundamentals',
      certificateCode: 'SOC-SF-2026-001',
      issuedDate: 'April 20, 2026',
      expiryDate: 'April 20, 2027',
      status: 'active',
      score: 95,
    },
  ];

  const filteredCertificates = certificates.filter((cert) => {
    if (filterBy === 'active') return cert.status === 'active';
    if (filterBy === 'expired') return cert.status === 'expired';
    return true;
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate certificate verification
    const found = certificates.find((c) => c.certificateCode === searchCode);
    if (found && found.status === 'active') {
      setVerifyResult({ valid: true, data: found });
    } else {
      setVerifyResult({ valid: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soc-dark to-soc-darker py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <FiAward className="text-soc-accent" size={40} />
            My Certificates
          </h1>
          <p className="text-soc-accent/70 text-lg">
            View your earned certificates and share your achievements
          </p>
        </div>

        {/* Verification Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-soc-accent/10 to-transparent border border-soc-accent/30 rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Verify a Certificate</h2>
          <form onSubmit={handleVerify} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter certificate code (e.g., SOC-LF-2026-001)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="flex-1 bg-soc-dark/80 border border-soc-accent/30 rounded-lg px-4 py-3 text-white placeholder-soc-accent/40 focus:border-soc-accent/60 focus:outline-none transition"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-soc-accent/50 transition-all"
            >
              Verify
            </button>
          </form>

          {verifyResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg border ${
                verifyResult.valid
                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}
            >
              {verifyResult.valid ? (
                <div className="flex items-start gap-3">
                  <FiCheckCircle size={24} className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Certificate Verified ✓</p>
                    <p className="text-sm">
                      {verifyResult.data.courseName} - Verified on May 8, 2026
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <FiAlertCircle size={24} className="flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Certificate Not Found</p>
                    <p className="text-sm">
                      The certificate code you entered could not be verified. Please check and try again.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          {[
            { key: 'all', label: 'All Certificates' },
            { key: 'active', label: 'Active' },
            { key: 'expired', label: 'Expired' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterBy(filter.key as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filterBy === filter.key
                  ? 'bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark'
                  : 'bg-soc-darker border border-soc-accent/50 text-soc-accent hover:border-soc-accent'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-lg overflow-hidden border transition hover:shadow-2xl hover:shadow-soc-accent/30 ${
                cert.status === 'active'
                  ? 'bg-gradient-to-br from-soc-accent/20 to-transparent border-soc-accent/50'
                  : 'bg-soc-darker/50 border-soc-accent/20 opacity-75'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cert.status === 'active'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}
                >
                  {cert.status === 'active' ? '✓ Active' : '✗ Expired'}
                </span>
              </div>

              {/* Certificate Content */}
              <div className="p-8 text-center relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-soc-accent/30"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-soc-accent/30"></div>

                {/* Award Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soc-accent to-cyan-400 flex items-center justify-center">
                    <FiAward className="text-soc-dark" size={32} />
                  </div>
                </div>

                {/* Certificate Details */}
                <h3 className="text-2xl font-bold text-white mb-2">Certificate of Completion</h3>
                <p className="text-soc-accent text-lg font-semibold mb-6">{cert.courseName}</p>

                {/* Score */}
                <div className="mb-6 p-4 bg-soc-dark/50 rounded-lg border border-soc-accent/20">
                  <p className="text-soc-accent/70 text-sm mb-1">Final Score</p>
                  <p className="text-3xl font-bold text-white">{cert.score}%</p>
                </div>

                {/* Certificate Code */}
                <div className="mb-6">
                  <p className="text-soc-accent/70 text-xs mb-1">Certificate Code</p>
                  <p className="text-white font-mono text-sm font-semibold">{cert.certificateCode}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div>
                    <p className="text-soc-accent/70 text-xs">Issued</p>
                    <p className="text-white font-semibold">{cert.issuedDate}</p>
                  </div>
                  <div>
                    <p className="text-soc-accent/70 text-xs">Expires</p>
                    <p className="text-white font-semibold">{cert.expiryDate}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded-lg font-semibold hover:border-soc-accent transition flex items-center justify-center gap-2">
                    <FiDownload size={18} /> Download
                  </button>
                  <button className="flex-1 py-2 bg-soc-darker border border-soc-accent/30 text-soc-accent rounded-lg font-semibold hover:border-soc-accent/60 transition flex items-center justify-center gap-2">
                    <FiShare2 size={18} /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-soc-darker/50 border border-soc-accent/20 rounded-lg"
          >
            <FiAward className="text-soc-accent/50 mx-auto mb-4" size={48} />
            <p className="text-soc-accent/70 text-lg mb-4">
              No {filterBy !== 'all' ? filterBy : ''} certificates found
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-2 bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-soc-accent/50 transition-all"
            >
              Earn Your First Certificate →
            </Link>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-soc-accent/5 border border-soc-accent/30 rounded-lg p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Certificate Information</h3>
          <ul className="space-y-3 text-soc-accent/70">
            <li className="flex items-start gap-3">
              <span className="text-soc-accent mt-1">•</span>
              <span>Certificates are valid for 1 year from the date of issue</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-soc-accent mt-1">•</span>
              <span>You must achieve a score of at least 70% to earn a certificate</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-soc-accent mt-1">•</span>
              <span>Certificates can be verified using the unique certificate code</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-soc-accent mt-1">•</span>
              <span>Download and share your certificates on professional networks</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
