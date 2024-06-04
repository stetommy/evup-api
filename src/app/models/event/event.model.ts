import mongoose, { Document, Schema } from 'mongoose';

export enum Currency {
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

export enum EventType {
  OpenBar = 'openbar',
  FreeEntry = 'freeentry',
  Consumption = 'consumption',
  Private = 'private',
}

export interface IEvent extends Document {
  _id: string;
  title: string;
  slug: string;
  sbtitle: string;
  address: string;
  special_guest: ISpecialGuest[];
  tags: Itag[];
  description: string;
  time_start: Date;
  time_end: Date;
  type: EventType;
  currency: Currency;
  picture_id: string;
  updated_on: Date;
  created_by: string;
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

/**
 * Interfaccia Tag provvisoria
 */
export interface Itag extends Document {
  _id: string;
  name: string;
}

/**
 * Tag Schema provvisorio prima di creare il modello dei tag per completare il dato a DB
 */
const tagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const eventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    sbtitle: {
      type: String,
    },
    address: {
      type: String,
    },
    special_guest: {
      type: specialGuestSchema,
    },
    tags: {
      type: tagSchema,
    },
    description: {
      type: String,
    },
    time_start: {
      type: Date,
    },
    time_end: {
      type: Date,
    },
    type: {
      type: String,
      enum: Object.values(EventType),
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
    },
    picture_id: {
      type: String,
    },
    update_on: {
      type: Date,
      default: Date.now 
    },
    created_by: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

const eventModel = mongoose.model<IEvent>('Events', eventSchema);
export default eventModel;
