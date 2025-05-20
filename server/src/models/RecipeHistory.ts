import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeHistory extends Document {
    userId: string;
    ingredients: string[];
    response: string;
    favorite: boolean;
    createdAt: Date;
}

const RecipeHistorySchema = new Schema<IRecipeHistory>({
    userId: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    response: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRecipeHistory>('RecipeHistory', RecipeHistorySchema);