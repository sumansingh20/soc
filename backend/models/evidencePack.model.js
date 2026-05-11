import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const evidenceSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: '' },
    kind: {
      type: String,
      enum: ['log', 'alert', 'terminal', 'network', 'process', 'note'],
      default: 'log',
    },
    content: { type: String, default: '' },
    source: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { _id: false }
);

const evidencePackSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    datasetSlug: { type: String, required: true, index: true },

    evidence: [evidenceSchema],

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const EvidencePack = model('EvidencePack', evidencePackSchema);
export default EvidencePack;

