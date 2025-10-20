import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  organizer_id: Schema.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  location: string;
  image_url?: string;
  start_date: Date;
  end_date: Date;
  ticket_price: number;
  total_tickets: number;
  available_tickets: number;
  created_at: Date;
  updated_at: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    organizer_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    ticket_price: {
      type: Number,
      required: true,
      min: 0,
    },
    total_tickets: {
      type: Number,
      required: true,
      min: 0,
    },
    available_tickets: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.organizer_id = ret.organizer_id?.toString();
        delete ret._id;
      },
    },
  }
);

export default mongoose.model<IEvent>('Event', EventSchema);
