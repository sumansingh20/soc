'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { courseApi } from '@/lib/api';
import { formatTime, getDifficultyColor, getDifficultyBgColor } from '@/utils/helpers';
import { FiClock, FiUsers, FiStar } from 'react-icons/fi';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, difficulty, category]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseApi.getAll({ limit: 50 });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (difficulty) {
      filtered = filtered.filter((c) => c.difficulty === difficulty);
    }

    if (category) {
      filtered = filtered.filter((c) => c.category === category);
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-2 neon-text"
      >
        Explore Courses
      </motion.h1>
      <p className="text-gray-400 mb-8">Master cybersecurity with our comprehensive training courses</p>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          title="Filter by difficulty"
          className="px-4 py-2 rounded-lg bg-soc-darker border border-soc-accent/30 text-white focus:outline-none focus:border-soc-accent"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          title="Filter by category"
          className="px-4 py-2 rounded-lg bg-soc-darker border border-soc-accent/30 text-white focus:outline-none focus:border-soc-accent"
        >
          <option value="">All Categories</option>
          <option value="siem">SIEM</option>
          <option value="threat-hunting">Threat Hunting</option>
          <option value="incident-response">Incident Response</option>
          <option value="dfir">DFIR</option>
          <option value="linux">Linux</option>
        </select>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-soc-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="glass rounded-lg overflow-hidden hover:border-soc-accent/50 transition-all group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Course Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-soc-accent/20 to-soc-accent-secondary/20 flex items-center justify-center overflow-hidden relative">
                <img
                  src={course.thumbnailUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%2300d4ff" width="100" height="100"/%3E%3C/svg%3E'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-soc-accent transition-colors">
                      {course.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyBgColor(course.difficulty)} ${getDifficultyColor(course.difficulty)}`}
                  >
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-gray-400 text-sm mb-4 pb-4 border-b border-soc-accent/20">
                  <div className="flex items-center gap-1">
                    <FiClock size={16} />
                    <span>{formatTime(course.durationHours * 60)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers size={16} />
                    <span>{course.studentsCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiStar size={16} />
                    <span>{course.rating?.toFixed(1)}</span>
                  </div>
                </div>

                {/* Button */}
                <Link href={`/courses/${course.slug}`} className="block w-full py-2 rounded-lg bg-soc-accent/10 text-soc-accent border border-soc-accent/30 hover:bg-soc-accent/20 transition-colors font-semibold text-sm text-center">
                  View Course
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No courses found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
