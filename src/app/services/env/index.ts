import * as dotenv from 'dotenv';

/**
 * Load the correct env
 * @param envPath env file path
 * @returns
 */
export default function loadEnv() {
  /** Specify the path to your custom .env file (optional) */

  /** Prod */
  //const EnvPath = '';

  /** Dev */
  const EnvPath = '.env.development';

  /** Default to .env if envPath is not provided */
  const envFilePath = EnvPath || './.env';
  /** Load environment variables from the specified .env file */
  return Object.freeze(dotenv.config({ path: envFilePath }).parsed || {});
}
