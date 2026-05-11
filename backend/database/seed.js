import bcrypt from 'bcryptjs';
import { connectMongoDB } from '../config/mongodb.js';
import { Course, Lesson, Lab, Note, Quiz, Command, Resource, User, Progress } from '../models/index.js';
import { courses, days, notes, commands, labs, quizzes, resources } from '../data/socContent.js';

const users = [
  { email: 'admin@hackshield.local', username: 'admin', fullName: 'HackShield Admin', role: 'admin' },
  { email: 'instructor@hackshield.local', username: 'instructor', fullName: 'HackShield Instructor', role: 'instructor' },
  { email: 'student@hackshield.local', username: 'student', fullName: 'HackShield Student', role: 'student' },
];

const upsertBySlug = async (model, slug, data) => {
  await model.updateOne({ slug }, { $set: data }, { upsert: true });
};

const main = async () => {
  await connectMongoDB();

  for (const course of courses) {
    await upsertBySlug(Course, course.slug, course);
  }

  for (let index = 0; index < days.length; index += 1) {
    const day = days[index];
    await upsertBySlug(Lesson, day.slug, {
      slug: day.slug,
      dayNumber: index + 1,
      dayLabel: day.dayLabel,
      title: day.title,
      summary: day.summary,
      courseSlug: day.courseSlug,
      notes: day.notes,
      commands: day.commands,
      labs: day.labs,
      quizSlug: day.quizSlug,
      downloadSlug: day.downloadSlug,
      published: true,
    });
  }

  for (const note of notes) {
    await upsertBySlug(Note, note.slug, note);
  }

  for (const command of commands) {
    await upsertBySlug(Command, command.slug, command);
  }

  for (const lab of labs) {
    await upsertBySlug(Lab, lab.slug, lab);
  }

  for (const quiz of quizzes) {
    await upsertBySlug(Quiz, quiz.slug, {
      ...quiz,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        answerIndex: question.answerIndex,
        explanation: question.explanation,
      })),
    });
  }

  for (const resource of resources) {
    await upsertBySlug(Resource, resource.slug, resource);
  }

  for (const user of users) {
    const passwordHash = await bcrypt.hash('student123', 12);
    await User.updateOne(
      { email: user.email },
      {
        $set: {
          ...user,
          passwordHash,
          status: 'active',
        },
      },
      { upsert: true }
    );
  }

  const seededStudent = await User.findOne({ email: 'student@hackshield.local' });
  if (seededStudent) {
    await Progress.updateOne(
      { userId: seededStudent._id },
      {
        $set: {
          courseProgress: [
            { courseSlug: 'soc-basics', progressPercentage: 45, status: 'in_progress' },
            { courseSlug: 'linux-log-analysis', progressPercentage: 25, status: 'in_progress' },
          ],
          lessonIdsCompleted: ['day-1'],
          labSlugsCompleted: ['ssh-brute-force-detection'],
          quizAttempts: [
            { quizSlug: 'day-1-quiz', score: 80, passed: true },
          ],
          noteDownloads: [{ noteSlug: 'day-1-notes' }],
          dailyTasks: [
            { daySlug: 'day-1', title: 'Read Day 1 notes', completed: true },
            { daySlug: 'day-2', title: 'Practice Linux logs', completed: false },
          ],
          notifications: [
            {
              title: 'Welcome to HackShield',
              message: 'Your SOC training dashboard is ready.',
              type: 'success',
              read: false,
            },
          ],
        },
      },
      { upsert: true }
    );
  }

  console.log('SOC training content seeded successfully.');
  process.exit(0);
};

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
