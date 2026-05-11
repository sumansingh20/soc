import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    completedLessons: [{ type: String }],
    downloadedNoteSlugs: [{ type: String }],
  },
  { timestamps: true }
);

const courseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'SOC Training' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    order: { type: Number, default: 0 },
    durationHours: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    thumbnailUrl: { type: String, default: '' },
    objectives: [{ type: String }],
    lessonSlugs: [{ type: String }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const lessonSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    courseSlug: { type: String, required: true, index: true },
    dayNumber: { type: Number, required: true, index: true },
    dayLabel: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    notes: [{ heading: String, body: String }],
    commands: [{ type: String }],
    labs: [{ type: String }],
    quizSlug: { type: String },
    downloadSlug: { type: String },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const labSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    scenario: { type: String, required: true },
    objective: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    category: { type: String, default: 'SOC Investigation' },
    tags: [{ type: String }],
    estimatedMinutes: { type: Number, default: 30 },
    estimatedTimeMinutes: { type: Number, default: 30 },
    logs: [{ type: String }],
    sampleLogs: [
      {
        source: String,
        line: String,
        clue: String,
      },
    ],
    commands: [{ type: String }],
    workflow: [{ type: String }],
    expectedFindings: [{ type: String }],
    solution: { type: String, required: true },
    published: { type: Boolean, default: true },
    submissions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        findings: String,
        report: String,
        score: Number,
        feedback: String,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const quizQuestionSchema = new Schema(
  {
    id: Number,
    question: String,
    options: [{ type: String }],
    answerIndex: Number,
    explanation: String,
  },
  { _id: false }
);

const quizSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    courseSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    passingScore: { type: Number, default: 70 },
    timeLimitMinutes: { type: Number, default: 30 },
    questions: [quizQuestionSchema],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const noteSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    courseSlug: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    sections: [{ heading: String, body: String }],
    tags: [{ type: String }],
    pdfTitle: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    courseProgress: [
      {
        courseSlug: String,
        progressPercentage: { type: Number, default: 0 },
        status: { type: String, enum: ['enrolled', 'in_progress', 'completed'], default: 'enrolled' },
        lastAccessedAt: { type: Date, default: Date.now },
      },
    ],
    lessonIdsCompleted: [{ type: String }],
    labSlugsCompleted: [{ type: String }],
    quizAttempts: [
      {
        quizSlug: String,
        score: Number,
        passed: Boolean,
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    noteDownloads: [
      {
        noteSlug: String,
        downloadedAt: { type: Date, default: Date.now },
      },
    ],
    downloadHistory: [
      {
        itemSlug: String,
        itemType: { type: String, enum: ['note', 'resource', 'pdf'], default: 'note' },
        downloadedAt: { type: Date, default: Date.now },
      },
    ],
    commandPractices: [
      {
        commandName: String,
        notes: String,
        practicedAt: { type: Date, default: Date.now },
      },
    ],
    dailyTasks: [
      {
        daySlug: String,
        title: String,
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
    notifications: [
      {
        title: String,
        message: String,
        type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const commandSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    syntax: { type: String, required: true },
    description: { type: String, required: true },
    example: { type: String, required: true },
    investigationUseCase: { type: String, required: true },
    practiceExercises: [{ type: String }],
    output: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const resourceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'cheatsheet', 'reference', 'link'], default: 'reference' },
    url: { type: String, default: '' },
    noteSlug: { type: String, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = models.User || model('User', userSchema);
export const Course = models.Course || model('Course', courseSchema);
export const Lesson = models.Lesson || model('Lesson', lessonSchema);
export const Lab = models.Lab || model('Lab', labSchema);
export const Quiz = models.Quiz || model('Quiz', quizSchema);
export const Note = models.Note || model('Note', noteSchema);
export const Progress = models.Progress || model('Progress', progressSchema);
export const Command = models.Command || model('Command', commandSchema);
export const Resource = models.Resource || model('Resource', resourceSchema);

export const publicUserShape = (user) => ({
  id: String(user._id),
  email: user.email,
  username: user.username,
  fullName: user.fullName,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});
