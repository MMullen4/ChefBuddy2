import { Schema, model, Document } from "mongoose";

interface IComment {
    user: string;
    text: string;
    createdAt: Date;
}

interface IRecipe extends Document {
  id: number;
  title: string;
  instructions: string;
  ingredients: Array<{
      name: string;
      quantity: string;
    }>;
    favorite: boolean;
    comments: IComment[];
    ratings: number;
}

const commentSchema = new Schema<IComment>({
    user: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const recipeSchema = new Schema<IRecipe>({
    title: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    ingredients: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
        },
    ],
    favorite: {
        type: Boolean,
        default: false,
    },
    ratings: {
        type: Number,
    },
    comments: [commentSchema],
});

const Recipe = model<IRecipe>("Recipe", recipeSchema);
export default Recipe;