import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  slug: string;
  price: number;
  billingRenew: number;
  description: string;
  includedItems: string[];
}

const planSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    billingRenew: {
      type: Number,
      required: true,
    },
    includedItems: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

const PlanModel = mongoose.model<IPlan>('Plan', planSchema);

export default PlanModel;