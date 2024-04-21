/**
 * AppModule is the app routing definition
 */

import express from "express";
import adaptRequest from "./middlewares/adapt-request";
import { RouteList } from "./uris";

/**
 * Cookie parser import
 */
// eslint-disable-next-line no-var, @typescript-eslint/no-var-requires
var cookieParser = require('cookie-parser');

/**
 * Require Express As AppModule
 */
const AppModule = express();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require("body-parser");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require("cors");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require("helmet");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const morgan = require("morgan");

/**
 * Define Default Route '/'
 */
AppModule.get("/", (req, res) => {
  res.send("EVUP-API");
});

/**
 * Adding Helmet to enhance your API's security
 */
AppModule.use(helmet());
/**
 * Use Request Adapter to make standard the requests.
 */
AppModule.use(adaptRequest);
/**
 * Using bodyParser to parse JSON bodies into JS objects
 */
AppModule.use(bodyParser.json());

/**
 * Use cookie parser
 */
AppModule.use(cookieParser());

/**
 * Enabling CORS for all requests
 */
AppModule.use(cors({ origin: [process.env.CORS_ORIGIN1, process.env.CORS_ORIGIN2], credentials: true }));

/**
 * Adding morgan to log HTTP requests
 */
AppModule.use(morgan("combined"));

/**
 * Add All Routes to App.
 */
RouteList.forEach((r) => {
  AppModule.use(r.path, r.module);
});
/**
 * Export AppModule
 */
export default AppModule;
