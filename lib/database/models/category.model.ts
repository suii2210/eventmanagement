import { Document, model, Schema, models } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    name: string;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
});

export const Category = models.Category || model<ICategory>('Category', CategorySchema);
