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
  try {
    await server.start();
    console.log("✅ Apollo Server started successfully.");

    try {
      await db();
      console.log("✅ Database connected.");
    } catch (dbError) {
      console.error("❌ Error starting Apollo Server:", dbError);
      // continue even if server fails to start
    }

    console.log("Node_ENV:", process.env.NODE_ENV);
    console.log("Port (raw):", process.env.PORT);

    const PORT = parseInt(process.env.PORT || "3001", 10);
    console.log("Port (parsed):", PORT);

    const app = express();

    // Add this near the top of your Express setup
    app.use((_req, res, next) => {
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Keep-Alive", "timeout=65");
      next();
    });

    // // Add this after your connection headers middleware
    // app.get("/", (_req, res) => {
    //   res.status(200).send("ChefBuddy API is running");
    // });

    // Add this right after your app declaration
    app.use(
      (
        req: express.Request,
        _res: express.Response,
        next: express.NextFunction
      ): void => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      }
    );

    app.get("/health", (_req, res) => {
      console.log("Health check requested");
      res.status(200).send("OK");
    });

    // Add this right after your health check endpoint
    app.get("/db-health", async (_req, res) => {
      try {
        // Import mongoose
        const mongoose = await import("mongoose");

        // Check connection state
        const connectionState = mongoose.default.connection.readyState;
        const connectionStates = {
          0: "disconnected",
          1: "connected",
          2: "connecting",
          3: "disconnecting",
          99: "uninitialized",
        };

        // Return connection info
        res.status(200).json({
          status: connectionStates[connectionState] || "unknown",
          readyState: connectionState,
          mongodbUri: process.env.MONGODB_URI
            ? process.env.MONGODB_URI.replace(
                /mongodb\+srv:\/\/([^:]+):[^@]+@/,
                "mongodb+srv://$1:***@"
              )
            : "Not set",
        });
      } catch (err) {
        console.error("DB health check error:", err);
        res.status(500).json({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    });

    app.use(
      cors({
        origin: [
          "https://chefbuddy2-production.up.railway.app",
          "http://localhost:3000",
        ],
        credentials: true,
      })
    );

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // ✅ GraphQL setup
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const authHeader = req.headers.authorization || "";
          const token = authHeader.split(" ")[1];
          const secret = process.env.JWT_SECRET_KEY;

          if (!token || !secret) {
            return {};
          }

          try {
            const decoded = jwt.verify(token, secret) as DecodedUserPayload;
            return { user: decoded.data };
          } catch (err) {
            console.error("Error verifying token:", err);
            return {};
          }
        },
      })
    );

    // ✅ Serve frontend in production
    if (process.env.NODE_ENV === "production") {
      console.log(
        "Servering static files from :",
        path.join(__dirname, "../../client/dist")
      );
      app.use(express.static(path.join(__dirname, "../../client/dist")));
      app.get("*", (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
      });
    }

    // Add this right before app.listen
    app.use(
      (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ): void => {
        console.error("Global error handler caught:", err);
        res.status(500).send("Something broke!");
      }
    );

    try {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`GraphQL available at http://0.0.0.0:${PORT}/graphql`);
        console.log(`Health check at http://0.0.0.0:${PORT}/health`);
      });
    } catch (listenError) {
      console.error("❌ Error starting Express server:", listenError);
    }
  } catch (error) {
    console.error("❌ Error starting Apollo Server:", error);
  }
};

startApolloServer();
