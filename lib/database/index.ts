import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseGlobal {
    mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const globalWithMongoose = global as typeof global & MongooseGlobal;
const cached = globalWithMongoose.mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'eventify',
        bufferCommands: false,
    });

    cached.conn = await cached.promise;
    return cached.conn;
};
