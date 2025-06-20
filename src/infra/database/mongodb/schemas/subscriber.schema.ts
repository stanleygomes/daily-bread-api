import mongoose, { Schema, Document, Model } from 'mongoose';

export interface SubscriberDocument extends Document {
  uuid: string;
  email: string;
  enabled: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const SubscriberSchema: Schema<SubscriberDocument> = new Schema<SubscriberDocument>({
  uuid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  created_at: { type: Date, required: false },
  updated_at: { type: Date, required: true },
}, { strict: false });

export const SubscriberModel: Model<SubscriberDocument> = mongoose.model<SubscriberDocument>('Subscriber', SubscriberSchema);
