import { Schema, model, Document } from "mongoose";

interface IComment {
    username: string;
    text: string;
    createdAt: Date;
}

interface IRecipe extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  instructions: string[];
  ingredients: Array<{
      name: string;
      quantity: string;
    }>;
    favorite: boolean;
    ratings?: number;
    comments: IComment[];
}

const commentSchema = new Schema<IComment>({
    username: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const recipeSchema = new Schema<IRecipe>({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    title: {
        type: String,
        required: true,
    },
    instructions: {
        type: [String],
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