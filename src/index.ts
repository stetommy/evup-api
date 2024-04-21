import loadEnv from './app/services/env';
import connectDB from './app/services/db';

/** Load environment variables from the specified .env file (or default to .env in the current directory) */
const env = loadEnv();

/** App PORT definition */
const port = env.APP_PORT || 3000;

/**
 * Mongoose connection to DB
 */
connectDB();

/**
 * Listen for app service.
 */
import AppModule from './app/index';
AppModule.listen(port, () => console.log(`Server Running on port : 🚀 http://localhost:${port}`));
