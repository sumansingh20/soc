import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const widgetRefSchema = new Schema(
  {
    widgetSlug: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const dashboardBoardSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    // A board typically renders over one or more dataset packs.
    datasetSlugs: [{ type: String }],

    widgetOrder: [widgetRefSchema],

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DashboardBoard = model('DashboardBoard', dashboardBoardSchema);
export default DashboardBoard;

