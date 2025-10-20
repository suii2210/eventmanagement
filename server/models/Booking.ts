import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  event_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  quantity: number;
  total_amount: number;
  booking_status: 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    booking_status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        const mutable = ret as typeof ret & {
          _id?: mongoose.Types.ObjectId;
          event_id?: mongoose.Types.ObjectId | string;
          user_id?: mongoose.Types.ObjectId | string;
          id?: string;
        };

        if (mutable._id) {
          mutable.id = mutable._id.toString();
          delete mutable._id;
        }

        if (mutable.event_id instanceof mongoose.Types.ObjectId) {
          mutable.event_id = mutable.event_id.toString();
        }

        if (mutable.user_id instanceof mongoose.Types.ObjectId) {
          mutable.user_id = mutable.user_id.toString();
        }
      },
    },
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
