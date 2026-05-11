'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { commandLessons } from '@/lib/soc-content';
import { commandApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { FiTerminal, FiAlertCircle, FiPlay } from 'react-icons/fi';

export default function CommandsPage() {
  const { token } = useAuthStore();
  const [commands, setCommands] = useState(commandLessons);
  const [activeCommand, setActiveCommand] = useState(commandLessons[0].name);
  const [message, setMessage] = useState('');
  const command = commands.find((item) => item.name === activeCommand) || commands[0];

  useEffect(() => {
    const loadCommands = async () => {
      try {
        const response = await commandApi.getAll();
        if (response.data.commands?.length) {
          const normalized = response.data.commands.map((item: any) => ({
            name: item.name,
            slug: item.slug,
            syntax: item.syntax,
            explanation: item.description,
            usage: item.investigationUseCase,
            example: item.example,
            mistakes: ['Running commands without a clear question', 'Forgetting to record the evidence you used'],
            output: item.output,
            exercises: item.practiceExercises || [],
          }));
          setCommands(normalized);
          setActiveCommand(normalized[0].name);
        }
      } catch {
        setCommands(commandLessons);
      }
    };

    loadCommands();
  }, []);

  const markPracticed = async () => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    await commandApi.practice((command as any).slug || command.name, `Practiced ${command.name} from command page.`);
    setMessage(`${command.name} practice saved to your dashboard.`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">Command Training</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Linux commands for SOC investigation</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Practice the commands analysts actually use when they need to move through logs, sessions, processes, and connections.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap mb-8">
          {commandLessons.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveCommand(item.name)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                activeCommand === item.name
                  ? 'bg-soc-accent text-soc-dark border-soc-accent'
                  : 'bg-soc-darker/70 text-soc-accent/70 border-soc-accent/20 hover:border-soc-accent/40'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiTerminal className="text-soc-accent" size={22} />
              <h2 className="text-2xl font-bold text-white">{command.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4 font-mono text-green-300">
                <p className="text-soc-accent mb-2">Syntax</p>
                <p>{command.syntax}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-2">Explanation</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{command.explanation}</p>
                </div>
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-2">SOC usage</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{command.usage}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-soc-dark/80 border border-soc-accent/15 p-4 font-mono text-sm text-green-300">
                <p className="text-soc-accent mb-2">Investigation example</p>
                <p>{command.example}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><FiAlertCircle className="text-soc-accent" /> Common mistakes</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {command.mistakes.map((mistake) => (
                      <li key={mistake}>• {mistake}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-2">Expected output</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{command.output}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-soc-accent/10 to-cyan-400/10 border border-soc-accent/15 p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><FiPlay className="text-soc-accent" /> Practice exercises</h3>
                <ul className="space-y-2 text-gray-200 text-sm">
                  {command.exercises.map((exercise) => (
                    <li key={exercise}>• {exercise}</li>
                  ))}
                </ul>
                <button onClick={markPracticed} className="mt-4 rounded-lg bg-soc-accent px-4 py-2 text-sm font-semibold text-soc-dark">
                  Mark command practiced
                </button>
                {message && <p className="mt-3 text-sm text-green-300">{message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl border border-soc-accent/15 p-6">
              <h3 className="text-white font-semibold mb-3">Interactive terminal box</h3>
              <div className="rounded-2xl bg-soc-dark/90 border border-soc-accent/15 p-4 font-mono text-green-300 text-sm">
                <p>$ {command.example}</p>
              </div>
            </div>

            <div className="glass rounded-3xl border border-soc-accent/15 p-6">
              <h3 className="text-white font-semibold mb-3">Why this matters</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                SOC analysts need fast, clear command use. These lessons help beginners read evidence without feeling lost in technical terms.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
