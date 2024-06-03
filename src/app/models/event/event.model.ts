import mongoose, { Document, Schema } from 'mongoose';

enum Currency {
  EUR = '€',
  USD = '$',
  CHF = 'CHF',
  NZD = 'NZD',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  BTC = 'BTC',
  ETH = 'ETH',
}

enum Type {
  OP = 'Open Bar',
  FE = 'Free Entry',
  AC = 'A Consumazione',
  PV = 'Privato',
}

export interface IEvent extends Document {
  _id: string;
  title: string;
  sbtitle: string;
  address: string;
  special_guest: [ISpecialGuest];
  tags: [];
  description: string;
  time_start: Date;
  time_end: Date;
  type: Type;
  currency: Currency;
  picture_id: string;
  updated_on: Date;
  created_by: Date;
  details: JSON;
}

export interface ISpecialGuest extends Document {
  _id: string;
  name: string;
}

const specialGuestSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const eventSchema: Schema = new Schema(
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
    special_guest: {
      type: specialGuestSchema,
    },
  },
  { timestamps: true },
);

const eventModel = mongoose.model<IEvent>('Events', eventSchema);
export default eventModel;

