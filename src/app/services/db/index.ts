import mongoose, { ConnectOptions } from 'mongoose'
import loadEnv from '../env'

/**
 * Load the environment variables
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = loadEnv()

/**
 * Set the connection parameters for mongo
 */
const url: string = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PSW}@${process.env.DATABASE_SERVER}/${process.env.DATABASE_NAME}?authMechanism=DEFAULT&authSource=admin`

const connectDB = async () => {
  //console.log(env.DATABASE_USER)
  try {
    // mongoose connect to db
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    // print db connection info
    console.log(`MongoDB Connected to: 🔗 ${mongoose.connection.host}`)
    console.log(`DB Name: 🏠 ${mongoose.connection.name}`)
  } catch (error) {
    console.error(`Error connecting to MongoDB: 🦄 ${error}`)
    process.exit(1)
  }
};

export default connectDB;
