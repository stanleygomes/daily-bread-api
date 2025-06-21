import mongoose, { Schema, Document, Model } from 'mongoose';
import { BreadType } from '../../../../domain/enums/bread-type.enum.js';

export interface BreadDocument extends Document {
  uuid: string;
  title: string;
  type: BreadType;
  message: string;
  date: string;
  created_at: Date | string;
  image: string;
}

const BreadSchema: Schema<BreadDocument> = new Schema<BreadDocument>({
  uuid: { type: String, required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(BreadType), 
    required: true 
  },
  message: { type: String, required: true },
  date: { type: String, required: true },
  created_at: { type: Schema.Types.Mixed, required: true },
  image: { type: String, required: true },
}, { strict: false });

export const BreadModel: Model<BreadDocument> = mongoose.model<BreadDocument>('Bread', BreadSchema);
