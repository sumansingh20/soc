import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const datasetSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    // SOC training datasets are usually evidence packs (logs, network traces, event JSON).
    // We keep the payload flexible as JSON.
    meta: {
      datasetType: {
        type: String,
        enum: ['auth_logs', 'syslog', 'apache_access', 'apache_error', 'auth_windows_events', 'network_pcap', 'endpoint_process', 'siem_events'],
        default: 'auth_logs',
      },
      sourceRegion: { type: String, default: '' },
      timeRange: { type: String, default: '' },
      hostCount: { type: Number, default: 1 },
    },

    // Raw dataset payload (embedded JSON) - keeps the app self-contained as requested.
    // Size may be large; for production you would typically store externally.
    payload: { type: Schema.Types.Mixed, required: true },

    // Optional indexing hints for faster UI filtering.
    indexes: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Dataset = model('Dataset', datasetSchema);
export default Dataset;

