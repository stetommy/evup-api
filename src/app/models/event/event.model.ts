import mongoose, { Schema, Document } from 'mongoose';

interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Schema.Types.ObjectId;
  image: string;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: false }
});

export default mongoose.model<IEvent>('Event', EventSchema);
