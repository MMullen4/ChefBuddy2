
// // export default db;
// import { fileURLToPath } from "url";
// import path from "node:path";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables from the custom .env path in the root directory
// const envPath = path.resolve(__dirname, "../../../.env");
// dotenv.config({ path: envPath });

// console.log("ENV loaded from:", envPath);
// console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);

// const db = async (): Promise<typeof mongoose.connection> => {
//   console.log(" all env variables :", Object.keys(process.env));

//   const MONGODB_URI = process.env.MONGODB_URI;
//   // const MONGODB_URI =
//   //   process.env.MONGODB_URI ||
//   //   "mongodb+srv://chef_buddy:group3@cluster0.4rxzs1c.mongodb.net/chef_buddy?retryWrites=true&w=majority&appName=Cluster0";
//   // console.log("MONGODB_URI:", MONGODB_URI);

//   if (!MONGODB_URI) {
//     throw new Error(
//       "❌ MONGODB_URI is not defined. Check your .env and path loading."
//     );
//   }

//   try {
//     console.log("MONGODB_URI right before connect:", MONGODB_URI);
//     await mongoose.connect(MONGODB_URI);
//     console.log("✅ Database connected.");
//     return mongoose.connection;
//   } catch (error) {
//     console.error("❌ Database connection error:", error);
//     throw new Error("Database connection failed.");
//   }
// };


import { fileURLToPath } from "url";
import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Check if MONGODB_URI is already defined in environment variables
if (!process.env.MONGODB_URI) {
  // If not defined, try to load from .env file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Try loading from different possible locations
  try {
    // Try root directory first
    const envPath = path.resolve(__dirname, "../../../.env");
    dotenv.config({ path: envPath });
    console.log("ENV loaded from:", envPath);
  } catch (error) {
    console.log("Error loading .env from root directory");
  }
}

console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);

const db = async (): Promise<typeof mongoose.connection> => {
  console.log(" all env variables :", Object.keys(process.env));

  // Use environment variable with fallback
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://chef_buddy:group3@cluster0.4rxzs1c.mongodb.net/chef_buddy?retryWrites=true&w=majority&appName=Cluster0";

  console.log("MONGODB_URI right before connect:", MONGODB_URI);

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
    });

    // event listeners for mongoose connection
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    console.log("✅ Database connected.");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.log('app will continue running even if database connection fails');
    return mongoose.connection; // Return the connection object even if it fails

    // throw new Error("Database connection failed.");
  }
};

export default db;
