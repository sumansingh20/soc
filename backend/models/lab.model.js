import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const labSubmissionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    findings: { type: String, default: '' },
    report: { type: String, default: '' },
    evidenceIds: [{ type: String }],
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const labSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    scenario: { type: String, required: true },
    objective: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    category: { type: String, default: 'SOC Investigation' },
    tags: [{ type: String }],
    estimatedMinutes: { type: Number, default: 30 },
    estimatedTimeMinutes: { type: Number, default: 30 },

    // Dataset-driven / evidence-driven training
    datasets: [
      {
        datasetSlug: { type: String, required: true },
      },
    ],
    evidencePacks: [
      {
        // For structured evidence references (log lines, alert objects, terminal outputs)
        id: { type: String, required: true },
        label: { type: String, default: '' },
        kind: { type: String, enum: ['log', 'alert', 'terminal', 'network', 'process', 'note'], default: 'log' },
        // Raw content is stored as string for flexibility
        content: { type: String, default: '' },
        source: { type: String, default: '' },
        tags: [{ type: String }],
      },
    ],

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

    // Evidence checklist used to evaluate student submissions
    requiredEvidenceIds: [{ type: String }],
    expectedFindings: [{ type: String }],

    solution: { type: String, required: true },
    rubrics: {
      // Optional enterprise rubric fields for scoring transparency
      overall: { type: String, default: '' },
      checklistWeight: { type: Number, default: 0.7 },
      rationaleWeight: { type: Number, default: 0.3 },
    },

    published: { type: Boolean, default: true },

    // Existing submissions storage (used by current UI)
    submissions: [labSubmissionSchema],
  },
  { timestamps: true }
);

export const Lab = model('Lab', labSchema);

export default Lab;

