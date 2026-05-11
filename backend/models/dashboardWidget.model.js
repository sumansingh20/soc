import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dashboardWidgetSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    boardSlugs: [{ type: String }],

    // widgetKind indicates how frontend should render.
    widgetKind: {
      type: String,
      enum: ['alert_counter', 'severity_timeline', 'investigation_feed', 'log_window', 'terminal_section', 'incident_panel', 'stats_chart'],
      default: 'investigation_feed',
    },

    datasetSlugs: [{ type: String }],

    // widget configuration is flexible JSON to support SOC-style widgets.
    config: { type: Schema.Types.Mixed, default: {} },

    // Optional evidence ids the widget should display.
    evidenceIds: [{ type: String }],

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DashboardWidget = model('DashboardWidget', dashboardWidgetSchema);
export default DashboardWidget;

