import mongoose, { Schema, Document, Model } from 'mongoose';

export interface BreadDocument extends Document {
  title: string;
  verse: string;
  summary: string;
  devotional: string[];
  prayer: string[];
  date: string;
  created_at: Date | string;
  image?: string;
}

const BreadSchema: Schema<BreadDocument> = new Schema<BreadDocument>({
  title: { type: String, required: true },
  verse: { type: String, required: true },
  summary: { type: String, required: true },
  devotional: { type: [String], required: true },
  prayer: { type: [String], required: true },
  date: { type: String, required: true },
  created_at: { type: Schema.Types.Mixed, required: true },
  image: { type: String },
}, { strict: false });

export const BreadModel: Model<BreadDocument> = mongoose.model<BreadDocument>('Bread', BreadSchema);




