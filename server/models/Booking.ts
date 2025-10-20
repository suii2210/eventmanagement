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
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.event_id = ret.event_id?.toString();
        ret.user_id = ret.user_id?.toString();
        delete ret._id;
      },
    },
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
