import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import { OpenAI } from 'openai';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.post('/api/recipes', async (req: Request, res: Response) => {
    const { ingredients } = req.body;
    
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of ingredients.' });
    }
   
    try {
      const prompt = `
      Suggest a list of recipes based on the following ingredients: ${ingredients.join(', ')}.
      Please provide the recipes in JSON format, including the recipe name, ingredients, measurements and instructions.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
    });

    const result = response.choices[0].message?.content;
    res.json({ recipes: result });
    } catch (error) {
      console.error('Error generating recipes:', error);
      res.status(500).json({ error: 'An error occurred while generating recipes.' });
    }
  });

  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
