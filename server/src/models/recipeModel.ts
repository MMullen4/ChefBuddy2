interface Recipe {
    id: number;
    title: string;
    instructions: string;
    ingredients: Array<{
        name: string;
        quantity: string;
    }>;
}