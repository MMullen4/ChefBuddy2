import mongoose, { Schema, Document } from 'mongoose';


export interface IRecipeHistory extends Document {
    profile: mongoose.Types.ObjectId;
    ingredients: string[];
    response: string;
    favorite: boolean;
    createdAt: Date;
}

const RecipeHistorySchema = new Schema<IRecipeHistory>({
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ingredients: [{ type: String, required: true }],
    response: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRecipeHistory>('RecipeHistory', RecipeHistorySchema);