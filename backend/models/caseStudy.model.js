import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const timelineItemSchema = new Schema(
  {
    at: { type: String, default: '' },
    // Human readable time string, e.g. "2026-05-11 02:16:07".
    // We keep it flexible because datasets vary.
    type: { type: String, default: 'event' },
    title: { type: String, required: true },
    evidenceIds: [{ type: String }],
    description: { type: String, default: '' },
  },
  { _id: false }
);

const stageSchema = new Schema(
  {
    stageSlug: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    objective: { type: String, default: '' },
    // evidenceIds is the evidence that should be discovered/checked in this stage
    evidenceIds: [{ type: String }],
    guidance: { type: String, default: '' },
  },
  { _id: false }
);

const caseStudySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },

    datasetSlugs: [{ type: String }],
    evidencePackSlugs: [{ type: String }],

    stages: [stageSchema],
    timeline: [timelineItemSchema],

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CaseStudy = model('CaseStudy', caseStudySchema);
export default CaseStudy;

