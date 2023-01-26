import "dotenv/config";

import { IClient } from "./structures";

/**
 * @description Mongoose set query
 */
import mongoose from "mongoose";
mongoose.set("strictQuery", true);

/**
 * @description Khemia login
 */
new IClient().login(process.env.TOKEN);
