import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('Inital Railway detected port :', process.env.PORT);

import jwt from 'jsonwebtoken';

import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
// import { authenticateToken } from './utils/auth.js';

interface DecodedUserPayload extends jwt.JwtPayload {
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const startApolloServer = async () => {
  await server.start();
  await db();

  // const PORT = process.env.PORT || 8080;
  const PORT =
    process.env.NODE_ENV === "production"
      ? process.env.PORT
      : process.env.PORT || 8080;

  if (!PORT) {
    throw new Error(
      "❌ PORT is not defined! Railway requires process.env.PORT."
    );
  }
  console.log('Server is running on port:', PORT);
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // ✅ GraphQL setup
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET_KEY;
        
        if (!token || !secret) {
          return {};
        };

        try {
          const decoded = jwt.verify(token, secret) as DecodedUserPayload;
          return { user: decoded.data };
        } catch (err) {
          console.error('Error verifying token:', err);
          return {};
        }
      },
    })
  );

  // ✅ Serve frontend in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`GraphQL ready at /graphql on port ${PORT}`);
  });
};

startApolloServer();
