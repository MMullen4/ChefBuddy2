import mongoose, { Schema, Document } from 'mongoose';


export interface IRecipeHistory extends Document {
    profile: mongoose.Types.ObjectId;
    title: string;
    instructions: string;
    ingredients: string[];
    response: string;
    favorite: boolean;
    mealType: string;
    createdAt: Date;
}

const RecipeHistorySchema = new Schema<IRecipeHistory>({
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    response: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'dessert'], default: 'lunch' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRecipeHistory>('RecipeHistory', RecipeHistorySchema);