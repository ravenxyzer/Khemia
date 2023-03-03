import "dotenv/config";
import { IClient } from "./structures";

import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const client = new IClient();

client.login(process.env.TOKEN);
