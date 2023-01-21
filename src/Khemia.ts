import "dotenv/config";
import { IClient } from "./Config";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);

new IClient().login(process.env.TOKEN);
