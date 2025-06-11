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

  console.log('Node_ENV:', process.env.NODE_ENV);
  console.log('Port:', process.env.PORT);

 const PORT = process.env.PORT || 8080;

// if (process.env.NODE_ENV === "production" && !process.env.PORT) {
//   throw new Error(
//     "❌ Railway requires binding to process.env.PORT, but it's not defined."
//   );
// }

  const app = express();

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.use(
    cors({
      origin: ['https://chefbuddy2-production.up.railway.app', 'http://localhost:3000'],
      credentials: true
    })
  );

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
